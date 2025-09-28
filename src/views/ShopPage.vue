<template>
    <div class="background-lines">
        <div class="container">
            <div class="wrapper">
                <div class="text-container">
                    <h2>Shop</h2>
                    <div class="coins-user">
                        <p>Coins: <span>{{userCoins}}</span></p>
                        <img src="../assets/coin-icon.svg" alt="coin icon">
                    </div>
                </div>
                <div class="scroll">
                    <div class="avatars-container">
                        <div class="avatar-category" v-for="avatar in avatars" :key="avatar.category">
                            <p>{{ avatar.category }} <span>{{ avatarsPerCategory(avatar.sources) }} / {{ avatar.sources.length }}</span></p>
                            <div class="images-wrapper">
                                <div class="image-item" v-for="source in avatar.sources" :key="source">
                                    <img @click="buyAvatar(source,avatar.price)" :src="source" :alt="avatar.category" class="avatar-img" :class="{ 'purchased': isPurchased(source) }">
                                    <div class="price-wrapper" v-if="!isPurchased(source)">
                                        <p>{{ avatar.price }}</p>
                                        <img src="../assets/coin-icon.svg" alt="coin">
                                    </div>
                                    <div class="owned-label" v-else>
                                        <p>Owned</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                <ButtonFooter />
            </div>
        </div>
    </div>
</template>

<script setup>
import avatars from '@/lib/shopData';
import { ref, onMounted, computed } from 'vue';
import { databases, account } from '@/lib/appwrite';
import { Query, ID} from 'appwrite';
import { toast } from 'vue3-toastify';
import { handleAchievements } from '@/lib/achievementsHandler';
import ButtonFooter from '@/components/ButtonFooter.vue';

let currentUser = ref(null);
let userCoins = ref(0);
const userStatsDocId = ref(null); //allows easy updates after buying new avatar
const userAvatarsDocId = ref(null)
const purchasedAvatars = ref([]);
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_user_stats_id = process.env.VUE_APP_COLLECTION_USER_STATS_ID;
const collection_user_avatars_id = process.env.VUE_APP_COLLECTION_USER_AVATARS_ID;

//computed properties
const avatarsPerCategory = computed(() => (sources) => {
    //using a filter to check how many sources from the category are included in the user's purchasedAvatars list.
    const owned = sources.filter(source => purchasedAvatars.value.includes(source));
    return owned.length;
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

//functions related to payments
async function buyAvatar(source, price) {
    if (isPurchased(source)) {
        toast.info("You already own this avatar.");
        return;
    }

    if (userCoins.value < price) {
        toast.error("Not enough coins to buy this avatar!");
        return;
    }

    try {
        //deducting coins after buying avatar
        const newCoinAmount = userCoins.value - price;
        await databases.updateDocument(database_id, collection_user_stats_id, userStatsDocId.value, {
            coin: newCoinAmount,
        });

        const newPurchasedAvatars = [...purchasedAvatars.value, source];

        if (userAvatarsDocId.value) {
            // if document exists update it
            await databases.updateDocument(database_id, collection_user_avatars_id, userAvatarsDocId.value, {
                purchased_avatars: newPurchasedAvatars,
            });
        } else {
            //if document doesn't exist create it
            const newDoc = await databases.createDocument(database_id, collection_user_avatars_id, ID.unique(), {
                user_id: currentUser.value.$id,
                purchased_avatars: newPurchasedAvatars,
            });
            //storing the ID of the new document for future updates
            userAvatarsDocId.value = newDoc.$id; 
        }
        userCoins.value = newCoinAmount;
        purchasedAvatars.value = newPurchasedAvatars;

        const totalPurchasedAvatars = newPurchasedAvatars.length;
        await handleAchievements({ avatarsPurchased: totalPurchasedAvatars });

    } catch (err) {
        console.error("Error processing avatar payment:", err);
    }
}

// other functions
function isPurchased(source) {
    return purchasedAvatars.value.includes(source);
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

        .coins-user {
            display: flex;
            gap: 4px;

            p{
                font-size: 28px;
                margin-bottom: 4px;
            }

            img {
                width: 36px;
                height: 36px;
            }
        }
    }

    .scroll {
        flex: 1; //take up whole space of container wrapper
        overflow-y: scroll; //enable vertical scroll
        padding-bottom: 100px;
        width: 100%;

        .avatars-container {
            display: flex;
            flex-direction: column;
            gap: 52px;
            margin: 20px 40px;
        
            .avatar-category {
               position: relative;
                display: flex;
                flex-direction: column;
                gap: 16px;

                p {
                    font-size: 1.3rem;
                    font-weight: 450;
                }

                .images-wrapper {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;

                    .image-item {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        .avatar-img {
                            width: 164px;
                            height: 164px;
                            border: 2px solid black;
                            border-radius: 50%;
                            transition: filter 0.5s ease;
                        }

                        .avatar-img:hover {
                            filter: brightness(60%);
                            cursor: pointer;
                        }
                        
                        .avatar-img.purchased {
                            filter: grayscale(100%);
                            cursor: default;
                            &:hover {
                                filter: grayscale(100%);
                            }
                        }

                        .price-wrapper {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            gap: 4px;
                            margin-top: 4px;
                            text-align: center;

                            img {
                                width: 28px;
                                border: none;
                            }

                            p {
                                margin: 0;
                                text-align: center;
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
    }
}

@media (max-width: 600px) {
    .container {
        
        .wrapper {
            width: 90vw; 
            height: 95vh;
            box-shadow: none;
        }

        .text-container {
            margin-top: 10px;

            h2 {
                font-size: 40px;
                margin-top: 20px;
            }

            .coins-user {
                p {
                    font-size: 20px;
                }
                img {
                    width: 28px;
                    height: 28px;
                }
            }
        }

        .scroll {
            padding-bottom: 80px;
            width: 95%;

            .avatars-container {
                gap: 40px;
                margin: 20px 0;
                padding-left: 10px;
            
                .avatar-category {
                    gap: 10px;

                    p {
                        font-size: 1.1rem; 
                        padding-left: 10px;
                    }

                    .images-wrapper {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 12px;

                        .image-item {

                            .avatar-img {
                                width: 80px; 
                                height: 80px;
                                border-width: 1px;
                            }

                            .price-wrapper {
                                gap: 2px;

                                p {
                                    font-size: 16px;
                                }
                                img {
                                    width: 20px;
                                }
                            }

                            .owned-label {
                                p {
                                    font-size: 14px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@media (max-width: 992px) {
    .container {
        .scroll {
            .avatars-container {
                .avatar-category {
                    .images-wrapper {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            }
        }
    }
}

@media (min-width: 992px) and (max-width: 1280px) {
    .container {
        .scroll {
            .avatars-container {
                .avatar-category {
                    .images-wrapper {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            }
        }
    }
}
</style>