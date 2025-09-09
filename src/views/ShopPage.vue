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
                            <p>{{ avatar.category }}</p>
                            <div class="images-wrapper">
                                <div class="image-item" v-for="source in avatar.sources" :key="source">
                                    <img @click="buyAvatar" :src="source" :alt="avatar.category" class="avatar-img">
                                    <div class="price-wrapper">
                                        <p>{{ avatar.price }}</p>
                                        <img src="../assets/coin-icon.svg" alt="coin">
                                    </div>
                                </div>
                            </div>

                            <!-- <div class="overlay-txt" v-if="isCategoryCompleted(category.name)"> 
                                <img src="../assets/completed-text.svg" alt="completed text">
                            </div>

                            <button v-if="!isCategoryCompleted(category.name)" @click="playCategory(category.name)">Play</button>
                            <div v-else>
                                <img src="../assets/tick.svg" alt="tick" class="tick">
                            </div> -->
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
import avatars from '@/lib/shopData';
import { ref, onMounted } from 'vue';
import { databases, account } from '@/lib/appwrite';
import { Query } from 'appwrite';
// import { toast } from 'vue3-toastify';

const router = useRouter();

let currentUser = ref(null);
let userCoins = ref(0);
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_user_stats_id = process.env.VUE_APP_COLLECTION_USER_STATS_ID;

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

async function getUserCoins () {
    try {
        const userStats = await databases.listDocuments(database_id, collection_user_stats_id, [Query.equal('user_id', currentUser.value.$id)]);

        if (userStats.total > 0) {
            const doc = userStats.documents[0];
            userCoins.value = doc.coin;
            //console.log("User stats updated successfully!");
        } else {
            console.log("Couldn't fetch coins");
        }
    } catch (err) {
        console.log("Error in getting coins:",err);
    }
}


//functions related to payments
// async function avatarPayment(amount) {
//     try {
//         if (!currentUser.value) {
//             await getUser();
//         }
        
//         const userStats = await databases.listDocuments(database_id, collection_user_stats_id, [Query.equal('user_id', currentUser.value.$id)]);
        
//         if (userStats.total > 0) {
//             const doc = userStats.documents[0];
            
//             if (userCoins >= amount) {
//                 const newCoinAmount = userCoins - amount;
//                 await databases.updateDocument(database_id, collection_user_stats_id, doc.$id, {
//                     coin: newCoinAmount,
//                 });
//                 return true; //payment was successful
//             } else if(userCoins < amount) {
//                 toast.error("Not enough coins to buy an avatar!");
//             }
//         }
//         return false; //payment failed (not enough coins or document not found)
//     } catch (err) {
//         console.error("Error processing avatar payment:", err);
//         return false;
//     }
// }

// async function buyAvatar() {
//      const paymentSuccessful = await avatarPayment(avatar.price);
    
// }


// other functions
function goBack() {
    router.back();
}


onMounted(async () => {
    await getUser();
    await getUserCoins();
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
        overflow-y: auto; //enable vertical scroll
        padding-bottom: 100px;
        width: 100%;

        .avatars-container {
            display: flex;
            flex-direction: column;
            gap: 40px;
            margin: 0 40px;
        
            .avatar-category {
               position: relative;
                display: flex;
                flex-direction: column;
                gap: 16px;

                .images-wrapper {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 12px;

                    .image-item {
                        display: flex;
                        flex-direction: column;

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