<template>
    <div 
        class="h-screen w-screen bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${require('@/assets/background-play.png')})` }"
    >
        <div class="flex min-h-screen items-center justify-center">
            <div class="relative flex h-[90vh] w-[60vw] flex-col items-center rounded-md bg-[#aecde5]/50 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)] backdrop-blur-[20px] max-[600px]:h-[95vh] max-[600px]:w-[90vw] max-[600px]:shadow-none">
                
                <div class="text-center">
                    <h2 class="mt-3 mb-1 text-[56px] font-medium max-[600px]:mt-5 max-[600px]:text-[40px]">Play</h2>
                    <p class="mb-1 text-[28px] max-[600px]:text-[20px]">Choose a category, scroll to show more.</p>
                    <p class="text-[24px] max-[600px]:text-[18px]">{{ completedLen }} / {{ categoryLen }} completed</p>
                </div>

                <div class="flex-1 overflow-y-auto pb-[100px] max-[600px]:pb-20">
                    <div class="mt-[42px] grid grid-cols-4 gap-[2vw] max-[1280px]:grid-cols-3 max-[992px]:grid-cols-2 max-[600px]:mt-[30px] max-[600px]:gap-[5vw]">
                        <div class="relative flex flex-col items-center gap-[1vw] max-[600px]:gap-[3vw]" v-for="category in categories" :key="category.name">
                            <img :src="category.image" :alt="category.name" class="w-[180px] rounded-md border-2 border-black max-[600px]:w-[140px]">

                            <div v-if="isCategoryCompleted(category.name)" class="absolute top-0 left-0 flex h-[180px] w-[180px] items-center justify-center rounded-md bg-black/50 max-[600px]:h-[140px] max-[600px]:w-[140px]"> 
                                <img src="../assets/completed-text.svg" alt="completed text" class="border-none px-3 max-[600px]:px-2">
                            </div>

                            <button v-if="!isCategoryCompleted(category.name)" @click="playCategory(category.name)" class="cursor-pointer rounded-[12px] border-2 border-black bg-[#2A8DC1] px-[6%] py-[1%] text-[20px] font-medium text-black transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] max-[600px]:px-[8%] max-[600px]:py-[3%] max-[600px]:text-[18px] max-[600px]:hover:scale-100 max-[600px]:hover:shadow-none">
                                Play
                            </button>
                            <div v-else>
                                <img src="../assets/tick.svg" alt="tick" class="w-[42px] border-none max-[600px]:w-9">
                            </div>
                        </div>
                    </div>
                </div>
                
                <ButtonFooter class="max-[600px]:absolute max-[600px]:bottom-0 max-[600px]:left-0 max-[600px]:right-0 max-[600px]:z-10 max-[600px]:w-full"/>
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import categories from '@/lib/categoriesPlay';
import { ref, onMounted } from 'vue';
import { databases, account } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { handleAchievements } from '@/lib/achievementsHandler';
import ButtonFooter from '@/components/ButtonFooter.vue';

const router = useRouter();

const categoryLen = categories.length;
const completedLen = ref(0);
const completedCategories = ref({}); //stored data to check if given category is completed

const currentUser = ref(null);
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_PLAY_ID;
const collection_progress_id = process.env.VUE_APP_COLLECTION_PROGRESS_PLAY_ID;


//checking if given category is completed
function isCategoryCompleted(name) {
    return !!completedCategories.value[name.toLowerCase().trim()]; //!! means that variable will always be boolean not null or undefined
}

//fetching puzzles and it's stages with progress
async function fetchPuzzlesProgress() {
    try {
        const user = await account.get();
        currentUser.value = user;

        const { documents: progressDocuments } = await databases.listDocuments(database_id, collection_progress_id, [Query.equal('user_id', user.$id)]);

        //pagination for fetch all of the documents - Appwrite only fetch 100 document but in collection is a lot more
        let puzzleDocuments = [];
        let offset = 0;
        let response;
        const limit = 100;

        do {
            response = await databases.listDocuments(database_id, collection_id, [Query.limit(limit),Query.offset(offset)]);
            puzzleDocuments = puzzleDocuments.concat(response.documents);
            offset += limit;
        } while (response.documents.length === limit);

        const maxStages = {};
        puzzleDocuments.forEach(doc => {
            const categoryName = doc.title.toLowerCase().trim();
            const stageNumber = parseInt(doc.puzzleId.split('-')[1]);
            if (!maxStages[categoryName] || stageNumber > maxStages[categoryName]) {
                maxStages[categoryName] = stageNumber;
            }
        });

        categories.forEach(cat => {
            completedCategories.value[cat.name.toLowerCase().trim()] = false;
        });

        progressDocuments.forEach(doc => {
            const categoryName = doc.category.toLowerCase().trim();
            const stagesData = JSON.parse(doc.stages_data);
            const totalStages = maxStages[categoryName]; 

            if (!totalStages) {
                return;
            }
            
            const userMaxStage = stagesData.userMaxStageReached;
            const finalStageData = stagesData[userMaxStage];
            const isCompleted = userMaxStage === totalStages && finalStageData.completed === true;

            completedCategories.value[categoryName] = isCompleted;
        });

        completedLen.value = Object.values(completedCategories.value).filter(Boolean).length;
        await handleAchievements({ completedCategoriesCount: completedLen.value });

    } catch (err) {
        console.error("Error fetching puzzle progress:", err);
    }
}

// other functions
function playCategory(name) {
    router.push({ path: '/wsplay', query: { category: name } });
}

onMounted(fetchPuzzlesProgress);
</script>