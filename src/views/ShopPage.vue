<template>
    <div 
        class="h-screen w-screen bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${require('@/assets/background-play.png')})` }"
    >
        <div class="flex min-h-screen items-center justify-center">
            <div class="relative flex h-[90vh] w-[60vw] flex-col items-center rounded-md bg-[#aecde5]/50 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)] backdrop-blur-[20px] max-[600px]:h-[95vh] max-[600px]:w-[90vw] max-[600px]:shadow-none">
                
                <div class="text-center">
                    <h2 class="mt-3 mb-1 text-[56px] font-medium max-[600px]:mt-5 max-[600px]:text-[40px]">Shop</h2>
                    <div class="flex justify-center items-center gap-1">
                        <p class="text-[28px] max-[600px]:text-[20px]">Coins: <span class="font-bold">{{userCoins}}</span></p>
                        <img src="../assets/coin-icon.svg" alt="coin icon" class="w-9 h-9 max-[600px]:w-7 max-[600px]:h-7">
                    </div>
                </div>

                <div class="flex-1 w-full overflow-y-auto pb-[100px] max-[600px]:pb-20 max-[600px]:w-[95%]">
                    <div class="my-5 mx-10 flex flex-col gap-[52px] max-[600px]:my-5 max-[600px]:mx-0 max-[600px]:pl-[10px] max-[600px]:gap-10">
                        
                        <div class="relative flex flex-col gap-4 max-[600px]:gap-[10px]" v-for="avatar in avatars" :key="avatar.category">
                            <p class="text-[1.3rem] font-[450] max-[600px]:text-[1.1rem] max-[600px]:pl-[10px]">
                                {{ avatar.category }} 
                                <span class="font-normal">{{ avatarsPerCategory(avatar.sources) }} / {{ avatar.sources.length }}</span>
                            </p>

                            <div class="grid grid-cols-4 gap-4 max-[1280px]:grid-cols-3 max-[992px]:grid-cols-2 max-[600px]:grid-cols-3 max-[600px]:gap-3">
                                <div class="flex flex-col items-center justify-center" v-for="source in avatar.sources" :key="source">
                                    <img 
                                        @click="buyAvatar(source,avatar.price)" 
                                        :src="source" 
                                        :alt="avatar.category" 
                                        class="h-[164px] w-[164px] cursor-pointer rounded-full border-2 border-black transition-all duration-500 hover:brightness-[60%] max-[600px]:h-20 max-[600px]:w-20 max-[600px]:border-[1px]" 
                                        :class="{ 'purchased !grayscale hover:!brightness-100 cursor-default': isPurchased(source) }"
                                    >
                                    
                                    <div class="mt-1 flex items-center justify-center gap-1 text-center" v-if="!isPurchased(source)">
                                        <p class="m-0 max-[600px]:text-[16px]">{{ avatar.price }}</p>
                                        <img src="../assets/coin-icon.svg" alt="coin" class="w-7 border-none max-[600px]:w-5">
                                    </div>
                                    <div class="mt-1 text-center" v-else>
                                        <p class="text-[20px] italic text-[#555] max-[600px]:text-[14px]">Owned</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                <ButtonFooter class="absolute bottom-0 left-0 right-0 z-10 w-full" />
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

<style scoped>
button {
    -webkit-tap-highlight-color: transparent;
    -webkit-text-fill-color: initial;
}

.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #57A4CD transparent;
}
</style>