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
                                <img :src="achievement.image" :alt="achievement.alt" class="achievement-img">
                                <!-- <div class="price-wrapper" v-if="!isPurchased(source)">
                                    <p>{{ avatar.price }}</p>
                                    <img src="../assets/coin-icon.svg" alt="coin">
                                </div>
                                <div class="owned-label" v-else>
                                    <p>Owned</p>
                                </div> -->
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
// import { toast } from 'vue3-toastify';

const router = useRouter();

let currentUser = ref(null);
let userCoins = ref(0);
const achievements_amount = achievements.length;
let achievements_count = ref(0);
const userStatsDocId = ref(null); //allows easy updates after buying new avatar
const userAvatarsDocId = ref(null)
const purchasedAvatars = ref([]);
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_user_stats_id = process.env.VUE_APP_COLLECTION_USER_STATS_ID;
const collection_user_avatars_id = process.env.VUE_APP_COLLECTION_USER_AVATARS_ID;

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
        const userStats = await databases.listDocuments(database_id, collection_user_stats_id, [Query.equal('user_id', currentUser.value.$id)]);
        if (userStats.total > 0) {
            const doc = userStats.documents[0];
            userStatsDocId.value = doc.$id;
            userCoins.value = doc.coin;
        }

        const userAvatars = await databases.listDocuments(database_id, collection_user_avatars_id, [Query.equal('user_id', currentUser.value.$id)]);
        if (userAvatars.total > 0) {
            const doc = userAvatars.documents[0];
            userAvatarsDocId.value = doc.$id;
            purchasedAvatars.value = doc.purchased_avatars || [];
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
                grid-template-columns: repeat(6, 1fr);
                gap: 12px;

                .image-item {
                    display: flex;
                    flex-direction: column;

                    .achievement-img {
                        width: 164px;
                        height: 164px;
                        border: 2px solid black;
                        border-radius: 6px;
                        filter: grayscale(1); //!HERE WILL CHANGEWHEN USER GET
                        // transition: filter 0.5s ease;
                    }

                    // .achievement-img:hover {
                    //     filter: brightness(60%);
                    //     cursor: pointer;
                    // }
                    
                    // .achievement-img.purchased {
                    //     filter: grayscale(100%);
                    //     cursor: default;
                    //     &:hover {
                    //         filter: grayscale(100%);
                    //     }
                    // }

                    .price-wrapper {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 4px;
                        margin-top: 4px;

                        img {
                            width: 28px;
                            border: none;
                        }
                    }

                    .owned-label {
                        text-align: center;
                        margin-top: 4px;
                        p {
                            font-size: 20px;
                            color: #555;
                            font-style: italic;
                        }
                    }
                }
            }
            .overlay-txt {
                position: absolute;
                top: 0;
                left: 0;
                width: 180px;
                height: 180px;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 6px;
                
                img {
                    border: none;
                    padding: 0px 12px;
                }
            }

            img {
                width: 180px;
                border: 2px solid black;
                border-radius: 6px;
            }

            .tick {
                border: none;
                width: 42px;
            }

            button {
                font-size: 20px;
                padding: 1% 6%;
                font-weight: 500;
                background-color: #2A8DC1;
                border: 2px solid black;
                border-radius: 12px;
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