<template>
    <div 
        class="h-screen w-screen bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${require('@/assets/background-play.png')})` }"
    >
        <div class="flex min-h-screen items-center justify-center">
            <div class="relative flex h-[90vh] w-[60vw] flex-col items-center rounded-md bg-[#aecde5]/50 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)] backdrop-blur-[20px] max-[600px]:h-[95vh] max-[600px]:w-[90vw] max-[600px]:shadow-none">
                
                <div class="text-center">
                    <h2 class="mt-3 mb-1 text-[56px] font-medium max-[600px]:mt-5 max-[600px]:text-[40px]">Challenge</h2>
                    <p class="mb-1 text-[28px] max-[600px]:text-[20px]">Take the challenge and test your skills, scroll to show more.</p>
                    <p class="text-[24px] max-[600px]:text-[18px]">{{ completedCount }}/{{categoryLen}} completed</p>
                </div>

                <div class="flex-1 overflow-y-auto pb-[100px] max-[600px]:pb-20">
                    <div class="mt-[42px] grid grid-cols-4 gap-[2vw] max-[1280px]:grid-cols-3 max-[992px]:grid-cols-2 max-[600px]:mt-[30px] max-[600px]:gap-[5vw]">
                        <div class="relative flex flex-col items-center gap-[1vw] max-[600px]:gap-[3vw]" v-for="category in categories" :key="category.name">
                            <img :src="category.image" :alt="category.name" class="challenge-img w-[180px] rounded-md border-4 border-[#FFBA08] max-[600px]:w-[140px] max-[600px]:border-[3px]">

                            <div v-if="categoryStarsNumber(category.name)" class="absolute top-0 left-0 flex h-[180px] w-[180px] flex-col items-center justify-center gap-3 rounded-md bg-black/50 max-[600px]:h-[140px] max-[600px]:w-[140px] max-[600px]:gap-2"> 
                                <img v-if="categoryStarsNumber(category.name) === 3" class="completed-text border-none max-[600px]:w-[124px]" src="../assets/completed-text.svg" alt="completed text">
                                
                                <div class="best-time rounded-md bg-black/40 px-[10px] py-[5px] text-[28px] font-medium tracking-wider text-[#FFBA08] max-[600px]:text-[20px]" style="text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">
                                    Best: {{ formatTime(getBestTime(category.name)) }}
                                </div>

                                <div class="stars">
                                    <!--adding not strictly HTML element - logic with stars, so it's better to use template than div, div can mess up styling-->
                                     <template v-for="s in 3" :key="s"> <img v-if="s <= categoryStarsNumber(category.name)" src="../assets/full-star.svg" alt="full star" class="inline w-[42px] max-[600px]:w-[30px]">
                                        <img v-else src="../assets/blank-star.svg" alt="blank star" class="inline w-[42px] max-[600px]:w-[30px]">
                                     </template>
                                </div>
                            </div>

                            <button v-if="!isChallengeCompleted(category.name)" class="challenge-btn cursor-pointer rounded-[12px] border-2 border-black bg-[#FFBA08] px-[6%] py-[1%] text-[20px] font-medium text-black transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] max-[600px]:px-[8%] max-[600px]:py-[3%] max-[600px]:text-[18px] max-[600px]:hover:scale-100 max-[600px]:hover:shadow-none" @click="playCategory(category.name)">Play</button>
                            <div v-else>
                                <img src="../assets/tick.svg" alt="tick" class="tick w-[42px] border-none">
                            </div>
                        </div>
                    </div>
                </div>
    
                <ButtonFooter class="absolute bottom-0 left-0 right-0 z-10 w-full"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { databases, account } from '@/lib/appwrite';
import { Query } from 'appwrite';
import categories from '@/lib/categoriesChallenge'
import { handleAchievements } from '@/lib/achievementsHandler';
import ButtonFooter from '@/components/ButtonFooter.vue';

const router = useRouter();
const categoryLen = categories.length;

//variables related to databse
const currentUser = ref(null);
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_progress_id = process.env.VUE_APP_COLLECTION_PROGRESS_CHALLENGE_ID;
const challengesProgress = ref({});
const completedCount = computed(() => { //computer automatically re-evaluates its value whenever one of its dependencies changes
    return Object.values(challengesProgress.value).reduce((count, data) => { //Object takes challengesProgress values and returns them as array like [{ best_time: 175, stars: 3 }
        //reduce iterate thru this array, count is a accumulator and it stars as given 0, data is current data in a loop
        if (data.stars === 3) {
            return count + 1; //adding to completed challenges count 
        }
        return count; //return unchaned count
    }, 0);
});


//functions related to databse
function isChallengeCompleted(name) {
    return challengesProgress.value[name]?.stars === 3; //if user gained 3 stars then challenge is marked completed 
}

function categoryStarsNumber(name) {
    // ?. means checking if the value before it (challengesProgress.value[name]) is not null or undefined
    return challengesProgress.value[name]?.stars || 0;
}

function getBestTime(name) {
    return challengesProgress.value[name]?.best_time;
}
async function fetchChallengeProgress() {
    try {
        const user = await account.get();
        currentUser.value = user;

        //pagination
        let progressDocuments = [];
        let offset = 0;
        const limit = 100;
        let response;

        do {
            response = await databases.listDocuments(database_id, collection_progress_id, [Query.equal('user_id', user.$id),Query.limit(limit),Query.offset(offset)]);
            progressDocuments = progressDocuments.concat(response.documents);
            offset += limit;
        } while (response.documents.length === limit);

        const temp = {};
        progressDocuments.forEach(doc => {
            const categoryName = doc.category;
            const challengeData = JSON.parse(doc.challenge_data);
            temp[categoryName] = challengeData;
        });

        challengesProgress.value = temp;
        
        await handleAchievements({ completedChallengesCount: completedCount.value });

    } catch (err) {
        console.error("Error fetching challenge progress:", err);
    }
}

function formatTime(seconds) {
    if (typeof seconds !== 'number' || seconds < 0) {
        return '00:00';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

function playCategory(name) {
    router.push({path: '/wschallenge', query: {category: name}});
}

onMounted( async () => {
    localStorage.removeItem('challenge-progress');
    fetchChallengeProgress();
})
</script>

<style scoped>
button {
    -webkit-tap-highlight-color: transparent;
    -webkit-text-fill-color: initial;
}
</style>