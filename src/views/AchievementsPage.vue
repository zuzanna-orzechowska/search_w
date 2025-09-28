<template>
    <div class="background-lines">
        <div class="container">
            <div class="wrapper">
                <div class="text-container">
                    <h2>Achievements</h2>
                    <p>Gained: <span>{{ achievements_count }} / {{ achievements_amount }}</span></p>
                </div>
                <div class="scroll">
                    <div class="achievements-container">
                        <div class="images-wrapper">
                            <div class="image-item" v-for="achievement in achievements" :key="achievement.image">
                                <img :src="achievement.image" :alt="achievement.alt" class="achievement-img" :class="{'grayscale-img': !unlockedAchievements.includes(achievement.name)}">
                                <div class="hover-overlay">
                                    <p class="description">{{ achievement.description }}</p>
                                </div>
                            </div>
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
import achievements from '@/lib/achievements';
import { ref, onMounted } from 'vue';
import { databases, account } from '@/lib/appwrite';
import { Query} from 'appwrite';

const router = useRouter();

let currentUser = ref(null);
let unlockedAchievements = ref([]); 
const achievements_amount = achievements.length;
let achievements_count = ref(0);
const userAchievementsDocId = ref(null);
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_user_achievements_id = process.env.VUE_APP_COLLECTION_USER_ACHIEVEMENTS_ID;

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

async function getUserData() {
    try {
        const userAchievements = await databases.listDocuments(database_id, collection_user_achievements_id, [Query.equal('user_id', currentUser.value.$id)]);
        if (userAchievements.total > 0) {
            const doc = userAchievements.documents[0];
            unlockedAchievements.value = doc.achievements;
            userAchievementsDocId.value = doc.$id;
            achievements_count.value = unlockedAchievements.value.length;
        }
    } catch (err) {
        console.log("Error in getting user data:", err);
    }
}

function goBack() {
    router.back();
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

    .text-container {
        text-align: center;

        h2 {
            font-size: 56px;
            font-weight: 500;
            margin-bottom: 4px;
            margin-top: 12px;
        }

        p{
            font-size: 28px;
            margin-bottom: 4px;
        }
    }

    .scroll {
        flex: 1; //take up whole space of container wrapper
        overflow-y: auto; //enable vertical scroll
        padding-bottom: 100px;
        width: 100%;

        .achievements-container {
            display: flex;
            flex-direction: column;
            gap: 40px;
            margin: 0 40px;
        
            .images-wrapper {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;

                .image-item {
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                    position: relative;

                    .achievement-img {
                        width: 200px;
                        height: 200px;
                        border: 2px solid black;
                        border-radius: 6px;
                        filter: grayscale(0);
                    }

                    .grayscale-img {
                        filter: grayscale(1);
                    }

                    .hover-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 200px;
                        height: 200px;
                        background-color: rgba(0, 0, 0, 0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 6px;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        text-align: center;
                    }

                    .description {
                        color: #fff;
                        font-size: 16px;
                        font-weight: bold;
                    }

                    //& means parent element, so longer version will be image-item:hover
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
            -webkit-tap-highlight-color: transparent;
            -webkit-text-fill-color: initial;
            color: black !important;
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

@media (max-width: 600px) {
    .container {
        
        .wrapper {
            width: 95vw; 
            height: 95vh;
            box-shadow: none;
            border-radius: 6px;
        }

        .text-container {

            h2 {
                font-size: 40px;
                margin-top: 20px;
            }

            p{
                font-size: 20px;
                margin-bottom: 10px;
            }
        }

        .scroll {
            padding-bottom: 80px;

            .achievements-container {
                gap: 20px;
                margin: 0 10px; 
            
                .images-wrapper {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;

                    .image-item {

                        .achievement-img {
                            width: 100%; 
                            height: auto;
                            max-width: 180px; 
                            max-height: 180px;
                        }

                        .hover-overlay {
                            width: 100%;
                            height: 100%;
                            max-width: 180px;
                            max-height: 180px;
                            padding: 5px;
                        }

                        .description {
                            font-size: 14px;
                        }
                    }
                }
            }
        }


        .footer {
            height: 60px;
            
            button {
                font-size: 18px; 
                padding: 4px 12px; 
            }
        }
    }
}

@media (max-width: 992px) {
    .container {
        .scroll {
            .achievements-container {
                .images-wrapper {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        }
    }
}

@media (min-width: 992px) and (max-width: 1280px) {
    .container {
        .scroll {
            .achievements-container {
                .images-wrapper {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
        }
    }
}
</style>