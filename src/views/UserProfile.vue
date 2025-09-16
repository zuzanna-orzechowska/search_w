<template>
    <div class="background-lines">
        <div class="container">
            <div class="wrapper">
                <h2>Profile</h2>
                <div class="scroll">
                    <div class="user-data">
                        <img :src="avatar" alt="User avatar">
                        <div class="username-wrapper">
                            <h4 v-if="!isEditingUsername">{{ username }}</h4>
                            <!--keyup.enter means if user clicks Enter on keyboard, new username will be saved to database-->
                            <input v-else type="text" v-model="newUsername" @keyup.enter="saveUsername" class="username-input">
                            <img src="../assets/edit-icon.svg" alt="Edit" @click="toggleEditMode">
                            <button v-if="isEditingUsername" @click="saveUsername" class="save-button">Save</button>
                        </div>
                        <p>{{ title }}</p>
                        <p>Level {{ level }}</p>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: progressBarWidth }"></div>
                            </div>
                            <p class="xp-to-next">{{ xpToNextLevel }} xp to next level</p>
                        </div>
                    </div>
                    <div class="avatars-container">
                        <h2>Avatars</h2>
                        <div class="images">
                            <img v-for="(av,ind) in userAvatars" :key="ind" :src="av" :class="{ 'selected-avatar': av === avatar }" @click="selectAvatar(av)">
                        </div>

                    </div>
                    <div class="achievements-container">
                        <h2>Achievements</h2>
                        <div v-if="userAchievements.length > 0" class="images">
                            <div class="image-item" v-for="(achiev,ind) in displayedAchievements" :key="ind">
                                <img :src="achiev.image">
                                <div class="hover-overlay">
                                    <p class="description">{{ achiev.description }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p>No achievements yet, checkout <router-link to="/achievements">Achievements</router-link> and conquer the world of words!</p>
                        </div>
                    </div>
                </div>
    
                <div class="footer">
                    <button @click="goBack">Back</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { databases, account } from '@/lib/appwrite';
import { Query} from 'appwrite';
import { levelData } from '@/lib/levelsData';
import { toast } from 'vue3-toastify';
import achievements from '@/lib/achievements';

const router = useRouter();

//variables related to databse
let currentUser = ref(null);
let avatar = ref('');
let username = ref('');
let title = ref('');
let level = ref(0);
let coins = ref(0);
let xp = ref(0);
let userAchievements = ref([]); 
const userStatsDocId = ref(null);
const userDocId = ref(null);
const isEditingUsername = ref(false);
const newUsername = ref('');
const userAvatars = ref([]);
const initialAvatar = ref('');
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_ID;
const collection_user_stats_id = process.env.VUE_APP_COLLECTION_USER_STATS_ID;
const collection_user_avatars_id = process.env.VUE_APP_COLLECTION_USER_AVATARS_ID;
const collection_user_achievements_id = process.env.VUE_APP_COLLECTION_USER_ACHIEVEMENTS_ID;

//computed properties for progress bar
const nextLevelXp = computed(() => {
    const nextLevel = levelData.find(levelObj => levelObj.number === level.value + 1); //finding object from levelData that matches next level that user can achievie
    return nextLevel ? nextLevel.xpNeeded : 0; //if user has enough xp for next level then retirning it, if no then returnig 0
});

const currentLevelXpNeeded = computed(() => {
    const currentLevel = levelData.find(levelObj => levelObj.number === level.value);
    return currentLevel ? currentLevel.xpNeeded : 0;
});

const xpToNextLevel = computed(() => {
    const remainingXp = nextLevelXp.value - xp.value;
    return remainingXp > 0 ? remainingXp : 0;
});

const progressBarWidth = computed(() => {
    const progress = xp.value - currentLevelXpNeeded.value;
    const totalNeeded = nextLevelXp.value - currentLevelXpNeeded.value;
    const percentage = (progress / totalNeeded) * 100; //percentages is needed for styling
    return isNaN(percentage) ? '0%' : `${percentage}%`;
});

const displayedAchievements = computed(() => {
    //mapping the array of achievement names from Appwrite to the full achievement objects
    return userAchievements.value.map(achievName => {
        return achievements.find(item => item.name === achievName);
    }).filter(Boolean); // .filter(Boolean) removes any undefined results
});


//functions related to database
async function getUser() { //what user is currenlty logged in
    try {
        const user = await account.get(); //getting info from session
        currentUser.value = user;
        return user;
    } catch (err) {
        console.log("Error: ",err);
    }
}

async function getUserData () {

    try {
        const userId = currentUser.value.$id;
        const userData = await databases.listDocuments(database_id,collection_id, [Query.equal('id_user',userId)]);
        const userDataProgress = await databases.listDocuments(database_id,collection_user_stats_id,[Query.equal('user_id',userId)]);
        const userPurchasedAvatars = await databases.listDocuments(database_id,collection_user_avatars_id,[Query.equal('user_id', userId)]);
        const userAchievementsData = await databases.listDocuments(database_id,collection_user_achievements_id,[Query.equal('user_id', userId)]);
        
        if(userData.total > 0) { //checking if databse return any document
            const userDocs = userData.documents[0]; //given value from first document is assigned to userDocs variable, so we can get avatar value from it
            userDocId.value = userDocs.$id;
            avatar.value = userDocs.avatar;
            username.value = userDocs.username;
            userAvatars.value.push(userDocs.avatar);
            //console.log("avatars: ",userAvatars.value)
            //console.log("Img src: ",avatar.value);
            //console.log("Username: ", username.value);
        }

        if(userDataProgress.total > 0) { //checking if database return any document
            const userDocsProgress = userDataProgress.documents[0]; //given value from first document is assigned to userDocsProgress variable, so we can get avatar value from it
            title.value = userDocsProgress.title;
            level.value = userDocsProgress.level;
            coins.value = userDocsProgress.coins;
            xp.value = userDocsProgress.xp;
            await levelUpSystem();
        }

        const allAvatars = new Set();
        
        //adding the current user's active avatar to the list
        if (avatar.value) {
            allAvatars.add(avatar.value);
        }

        if (userPurchasedAvatars.total > 0) {
            const userAvatarsData = userPurchasedAvatars.documents[0];

            // getting initial avatar from database and adding it to allAvatars so it won't disappear
            initialAvatar.value = userAvatarsData.initial_avatar;
            if (initialAvatar.value) {
                allAvatars.add(initialAvatar.value);
            }

            //getting the purchased avatars array and add them to allAvatars / checking for null
            if (userAvatarsData.purchased_avatars && Array.isArray(userAvatarsData.purchased_avatars)) {
                userAvatarsData.purchased_avatars.forEach(av => allAvatars.add(av));
            }
        }

        const allAchievements = new Set(); //Set element is similar to array but it doesn't allow duplicates
        if(userAchievementsData.total > 0) {
            const userDocsAchievements = userAchievementsData.documents[0]; 
            if (userDocsAchievements.achievements && Array.isArray(userDocsAchievements.achievements)) {
                userDocsAchievements.achievements.forEach(achiev => allAchievements.add(achiev));
            }
        }
        
        //converting back to an array and assigning it to the reactive variable
        userAvatars.value = Array.from(allAvatars);
        userAchievements.value = Array.from(allAchievements);

    } catch(err) {
        console.log("Error: ",err);
    }
}


async function levelUpSystem() { //function that checks user level and update data in database properly
    //sorting levels in descending order to find the highest level the user qualifies for
    const sortedLevels = [...levelData].sort((a, b) => b.xpNeeded - a.xpNeeded); //... means every object from array
    
    //finding the highest level the user qualifies for based on their XP
    const newLevelData = sortedLevels.find(l => l.xpNeeded <= xp.value);
    
    //checking if a level up occurred and the document ID is available
    if (newLevelData && newLevelData.number > level.value && userStatsDocId.value) {
        const newLevel = newLevelData.number;
        const newTitle = newLevelData.title;

        try {
            //updating the database with the new level and title
            await databases.updateDocument(database_id,collection_user_stats_id,userStatsDocId.value,{level: newLevel,title: newTitle,});
            level.value = newLevel;
            title.value = newTitle;
            //!TOAST LATER???
            //console.log(`Congratulations! You've leveled up to level ${newLevel} and earned the title '${newTitle}'.`);
        } catch (err) {
            console.error("Error updating user stats document:", err);
        }
    }
}

async function uniqueUsername(username) { //checking if new username is still unique
    try {
        const checkUsername = await databases.listDocuments(database_id, collection_id, [Query.equal('username', username)]);
        return checkUsername.total === 0;
    } catch (err) {
        console.log("Error checking unique username: ", err);
        return false;
    }
}

async function saveUsername() { //saving username to database
    if (!isEditingUsername.value) return;

    if (newUsername.value === username.value) {
        toast.info("Username is already the same.");
        isEditingUsername.value = false;
        return;
    }
    
    const isUsernameUnique = await uniqueUsername(newUsername.value);
    
    if (!isUsernameUnique) {
        toast.error("This username is already in use.");
        newUsername.value = username.value;
        return;
    }

    try {
        await databases.updateDocument(database_id,collection_id,userDocId.value,{username: newUsername.value});
        username.value = newUsername.value;
        toast.success("Username updated successfully!");
        isEditingUsername.value = false;
    } catch (err) {
        console.error("Error updating username:", err);
        toast.error("Failed to update username.");
    }
}

async function selectAvatar(newAvatarSource) {
    if (newAvatarSource === avatar.value) return;

    try {
        await databases.updateDocument(
            database_id,
            collection_id,
            userDocId.value,
            {
                avatar: newAvatarSource,
            }
        );
        avatar.value = newAvatarSource;
        toast.success("Avatar updated successfully!");
    } catch (err) {
        console.error("Error updating avatar:", err);
        toast.error("Failed to update avatar.");
    }
}


//other functions
function goBack() {
    router.back();
}

function toggleEditMode() {
    isEditingUsername.value = !isEditingUsername.value;
    if (isEditingUsername.value) {
        newUsername.value = username.value;
    }
}


onMounted(async () => {
    await getUser();
    await getUserData();
});
</script>


<style lang="scss" scoped>
.background-lines {
    background-image: url("../assets/background-play.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100vw;
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    
    .wrapper {
        background-color: rgba(174, 210, 229,0.5);
        backdrop-filter: blur(20px);
        width: 60vw;
        height: 90vh;
        border-radius: 6px;
        box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        flex-direction: column;
        position: relative;
    }

    
    h2 {
        font-size: 36px;
        font-weight: 500;
        margin-bottom: 4px;
        margin-top: 12px;
    }

    .scroll {
        flex: 1; //take up whole space of container wrapper
        overflow-y: auto; //enable vertical scroll
        padding-bottom: 100px;
        width: 100%;

        .user-data {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;
            margin: 20px 40px;
        
            img {
                width: 142px;
            }

            .username-wrapper {
                display: flex;
                gap: 8px;
                justify-content: center;

                h4{
                    font-size: 20px;
                }

                img {
                    width: 24px;
                }

                img:hover {
                    cursor: pointer;
                }
            }

            .progress-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 80%;
                margin-top: 20px;
            }

            .progress-bar {
                width: 100%;
                height: 10px;
                background-color: #d1d1d1;
                border-radius: 5px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background-color: #8c8c8c;
                transition: width 0.5s ease-in-out;
            }

            .xp-to-next {
                font-size: 16px;
                margin-top: 8px;
            }
        }

        .avatars-container {
            .images {
                display: flex;
                gap: 12px;

                img {
                    width: 164px;
                    height: 164px;
                    border: 2px solid black;
                    border-radius: 50%;
                }

                img:hover {
                    cursor: pointer;
                }

                .selected-avatar {
                    border: 4px solid #4ade80;
                    box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
                }
            }
        }

        .achievements-container {
            .images {
                display: flex;
                gap: 12px;
                position: relative;

                .image-item {
                    position: relative;

                    img {
                        width: 180px;
                        height: 180px;
                        border: 2px solid black;
                        border-radius: 6px;
                    }

                    .hover-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 180px;
                        height: 180px;
                        background-color: rgba(0, 0, 0, 0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 6px;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        text-align: center;
                        padding: 10px;
                    }

                    .description {
                        color: #fff;
                        font-size: 16px;
                        font-weight: bold;
                    }

                    &:hover {
                        .hover-overlay {
                            opacity: 1;
                        }
                    }
                }
            }
        }
    }


    .footer {
        background-color: rgb(174, 210, 229);
        width: 100%;
        height: 80px;
        position: fixed;
        bottom: 0px;
        left: 0px;
        button {
            font-size: 24px;
            padding: 1% 2%;
            font-weight: 500;
            background-color: #f9f9f9;
            border: 2px solid black;
            border-radius: 6px;
            cursor: pointer;
            transform: perspective(1px) translateZ(0);
            box-shadow: 0 0 1px transparent;
            transition-duration: 0.3s;
            transition-property: box-shadow, transform;
        }

        button:hover {
            box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86);
            transform: scale(1.1);
        }
    }
}

</style>