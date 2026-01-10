<template>
    <div 
        class="h-screen w-screen bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${require('@/assets/background-play.png')})` }"
    >
        <div class="flex min-h-screen items-center justify-center">
            <div class="relative flex h-[95vh] w-[95vw] flex-col items-center rounded-md bg-[#aecde5]/50 shadow-none backdrop-blur-[20px] md:h-[90vh] md:w-[60vw] md:shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)]">
                
                <div class="text-center">
                    <h2 class="mt-5 mb-1 text-[40px] font-medium md:mt-3 md:text-[56px]">Achievements</h2>
                    <p class="mb-[10px] text-[20px] md:mb-1 md:text-[28px]">Gained: <span class="font-bold">{{ achievements_count }} / {{ achievements_amount }}</span></p>
                </div>

                <div class="flex-1 w-full overflow-y-auto pb-20 md:pb-[100px]">
                    <div class="mx-[10px] flex flex-col gap-5 md:mx-10 md:gap-10">
                        <div class="grid grid-cols-2 gap-[10px] md:grid-cols-3 lg:grid-cols-4 md:gap-3">
                            <div class="group relative flex flex-col cursor-pointer items-center" v-for="achievement in achievements" :key="achievement.image">
                                <img :src="achievement.image" :alt="achievement.alt" 
                                    class="h-auto w-full max-w-[180px] max-h-[180px] border-2 border-black rounded-md md:h-[200px] md:w-[200px] md:max-w-none md:max-h-none transition-all duration-300"
                                    :class="{'grayscale': !unlockedAchievements.includes(achievement.name)}"
                                >
                                
                                <div class="absolute top-0 flex h-full w-full max-w-[180px] max-h-[180px] items-center justify-center rounded-md bg-black/60 p-[5px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:h-[200px] md:w-[200px] md:max-w-none md:max-h-none md:p-0">
                                    <p class="text-center text-[14px] font-bold text-white md:text-[16px]">
                                        {{ achievement.description }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="fixed bottom-0 left-0 flex h-[60px] w-full items-center justify-center bg-[#aecde5] md:h-20">
                    <button @click="goBack"
                        class="cursor-pointer rounded-md border-2 border-black bg-[#f9f9f9] px-3 py-1 text-[18px] font-medium text-black transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] md:px-[2%] md:py-[1%] md:text-[24px]"
                        style="-webkit-tap-highlight-color: transparent;">
                        Back
                    </button>
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