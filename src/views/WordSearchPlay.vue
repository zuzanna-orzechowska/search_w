<template>
    <div class="h-screen w-screen overflow-y-auto bg-[#aed2e5]">
        <div class="relative flex flex-col items-center bg-[#aed2e5] pb-[50px] px-4">
            
            <WordSearchHeader :userCoins="userStore.coins" :userAvatar="userStore.avatar" :showCoinsDeducted="showCoinsDeducted" :hintCost="hintCost" :dropdownActive="dropdownActive"
                @toggleDropdown="dropdownActive = !dropdownActive" @closeDropdown="dropdownActive = false"/>

            <div class="mt-1 text-center">
                <h2 class="m-0 text-[36px] min-[601px]:text-[56px] font-bold">{{ categoryName }}</h2>
                <p class="text-[32px]">{{ currentStage }} / {{ maxStage }}</p>
                <p class="text-[20px] max-w-2xl">Words may appear horizontally, vertically and diagonally, forwards and backwards.</p>
            </div>

            <div class="mt-8 flex flex-col min-[992px]:flex-row items-center min-[992px]:items-start justify-center gap-10 w-full max-w-[1200px] mx-auto">
                
                <div class="w-full min-[992px]:w-1/4 max-w-[300px]">
                    <WordSearchList :wordsToFind="wordsToFind" :foundWords="foundWords" />
                </div>
    
                <div class="w-full min-[992px]:w-2/3 max-w-[600px] flex justify-center">
                    <WordSearchGrid :grid="grid" :selection="selection" :selectionColor="selectionColor" :foundWordsData="foundWordsData" :wordsColor="wordsColor" :hintedCell="hintedCell"
                        @start="handleStart" @extend="handleExtend" @end="handleEnd"/>
                </div>
            </div>

            <div class="mt-8 flex w-[280px] items-center justify-center gap-6 rounded-[24px] border-4 border-black bg-[#57A4CD] py-2">
                <img @click="goBack" src="../assets/home-icon.svg" alt="home icon" class="w-[44px] cursor-pointer">
                <div class="relative">
                    <span v-if="showHintCost" class="absolute bottom-[110%] left-1/2 -translate-x-1/2 rounded-sm bg-[#f9f9f9] px-2 py-1 font-bold">
                        {{ hintCost }}
                    </span>
                    <img @click="showHint" @mouseover="showHintCost = true" @mouseleave="showHintCost = false" src="../assets/hint-icon.svg" alt="hint icon" class="w-[44px] cursor-pointer"
                    >
                </div>
            </div>

            <div v-if="showPuzzleDone" class="absolute left-1/2 top-1/2 z-[100] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl bg-[#71accc]/80 p-10 text-center backdrop-blur-md w-[90%] max-w-[600px]">
                <h2 class="text-[40px] min-[601px]:text-[54px] font-bold">Puzzle completed!</h2>
                <div class="flex justify-center gap-8 min-[601px]:gap-[64px] text-[18px] min-[601px]:text-[24px]">
                    <div class="flex items-center gap-2">
                        <p>+ {{ puzzleCoins }} coins</p>
                        <img src="../assets/coin-icon.svg" alt="coin icon" class="w-8 min-[601px]:w-12">
                    </div>
                    <div class="flex items-center gap-2">
                        <p>+ {{ puzzleXp }} exp</p>
                        <img src="../assets/exp-icon.svg" alt="exp icon" class="w-8 min-[601px]:w-12">
                    </div>
                </div>
                <div class="mt-5 flex justify-center gap-4 min-[601px]:gap-[64px]">
                    <button @click="goBack" class="cursor-pointer rounded-md border-2 border-black p-2 min-[601px]:p-[10px_40px] text-[20px] min-[601px]:text-[24px] bg-white">Back</button>
                    <button @click="nextStage" class="cursor-pointer rounded-md border-2 border-black bg-[#71ACCC] p-2 min-[601px]:p-[10px_40px] text-[20px] min-[601px]:text-[24px]">Next</button>
                </div>
            </div>

            <div v-if="showCategoryDone" class="absolute left-1/2 top-1/2 z-[100] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl bg-[#71accc]/80 p-10 text-center backdrop-blur-md w-[90%] max-w-[600px]">
                <h2 class="text-[40px] min-[601px]:text-[54px] font-bold">Congratulations!</h2>
                <p class="text-[18px] min-[601px]:text-[24px]">You've completed all puzzles in this category</p>
                <img src="../assets/blueFluff.svg" alt="blue fluff" class="my-4 w-32 min-[601px]:w-48">
                <div class="mt-5 flex justify-center gap-[64px]">
                    <button @click="goBack" class="cursor-pointer rounded-md border-2 border-black p-[10px_40px] text-[20px] min-[601px]:text-[24px] bg-white">Back</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { useWordSearch } from '@/composables/useWordSearch';
import { useUserStore } from '@/stores/user';
import { useGameStore } from '@/stores/game';
import WordSearchHeader from '@/components/WordSearchHeader.vue';
import WordSearchList from '@/components/WordSearchList.vue';
import WordSearchGrid from '@/components/WordSearchGrid.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const gameStore = useGameStore();

//grid
const { 
    grid, selection, isSelecting, startCell, selectionColor, 
    wordsColor, foundWordsData, allWordsData, generateGrid 
} = useWordSearch(12);

const dropdownActive = ref(false);
const wordsToFind = ref([]);
const category = route.query.category;
const categoryName = ref(category.charAt(0).toUpperCase() + category.slice(1));
const foundWords = ref([]);
const hintedCell = ref(null);

const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_progress_id = process.env.VUE_APP_COLLECTION_PROGRESS_PLAY_ID;

let currentStage = ref(1);
let maxStage = ref();
const showPuzzleDone = ref(false);
const showCategoryDone = ref(false);

let progressData = {};
const puzzleXp = ref(0);
const puzzleCoins = ref(0);
const hintCost = ref(20);
const showHintCost = ref(false);
const showCoinsDeducted = ref(false);

async function loadStage(stage) {
    try {
        const stageDoc = await findStagePuzzle(stage);
        if (!stageDoc) return;

        puzzleXp.value = stageDoc.xp;
        puzzleCoins.value = stageDoc.coin;
        wordsToFind.value = stageDoc.searchWord.sort((a, b) => a.localeCompare(b));
        currentStage.value = stage;

        const stageProgress = progressData[stage];
        if (stageProgress) {
            foundWords.value = stageProgress.foundWords || [];
            foundWordsData.value = JSON.parse(stageProgress.foundWordsData || '[]');
            wordsColor.value = JSON.parse(stageProgress.wordsColor || '{}');
            grid.value = JSON.parse(stageProgress.grid || '[]');
            showPuzzleDone.value = stageProgress.completed || false;
        } else {
            resetStageState();
            generateGrid(wordsToFind.value);
        }
    } catch (err) { console.error("Error loading stage:", err); }
}

function resetStageState() {
    foundWords.value = [];
    foundWordsData.value = [];
    wordsColor.value = {};
    grid.value = [];
    showPuzzleDone.value = false;
    allWordsData.value = [];
}

async function findStagePuzzle(stage) {
    const docs = await gameStore.fetchPuzzleData(category, false);
    return docs.find(doc => parseInt(doc.puzzleId.split('-')[1]) === stage);
}

async function loadData() {
    try {
        const docs = await gameStore.fetchPuzzleData(category, false);
        if (docs.length === 0) return;
        
        maxStage.value = Math.max(...docs.map(doc => parseInt(doc.puzzleId.split('-')[1])));
        
        await loadProgressDocument();
        await loadStage(currentStage.value);
    } catch (err) { console.error("Error loading data:", err); }
}

async function loadProgressDocument() {
    const progressDocs = await databases.listDocuments(database_id, collection_progress_id, [
        Query.equal("user_id", userStore.currentUser.$id), 
        Query.equal("category", category)
    ]);
    
    if (progressDocs.total > 0) {
        progressData = JSON.parse(progressDocs.documents[0].stages_data);
        currentStage.value = progressData.userMaxStageReached || 1;
    } else {
        progressData = {};
        currentStage.value = 1;
    }
}

async function saveProgress(completed = false) {
    progressData[currentStage.value] = {
        completed,
        puzzleId: `${category}-${currentStage.value}`,
        foundWords: foundWords.value,
        foundWordsData: JSON.stringify(foundWordsData.value),
        grid: JSON.stringify(grid.value),
        wordsColor: JSON.stringify(wordsColor.value),
    };
    progressData.userMaxStageReached = Math.max(progressData.userMaxStageReached || 0, currentStage.value);
    
    await gameStore.savePlayProgress(userStore.currentUser.$id, category, progressData);
}

// interacting with grid
const handleStart = (r, c) => {
    isSelecting.value = true;
    startCell.value = { row: r, col: c };
    selection.value = [{ row: r, col: c }];
    selectionColor.value = `rgb(${Math.floor(Math.random()*156+50)},${Math.floor(Math.random()*156+50)},${Math.floor(Math.random()*156+50)})`;
};

const handleExtend = (r, c) => {
    if (!isSelecting.value || !startCell.value) return;
    const dx = c - startCell.value.col;
    const dy = r - startCell.value.row;
    const len = Math.max(Math.abs(dx), Math.abs(dy)) + 1;
    const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
    const stepY = dy === 0 ? 0 : dy / Math.abs(dy);

    selection.value = Array.from({ length: len }, (_, i) => ({
        row: startCell.value.row + stepY * i,
        col: startCell.value.col + stepX * i
    }));
};

const handleEnd = async () => {
    if (!isSelecting.value) return;
    isSelecting.value = false;
    const word = selection.value.map(p => grid.value[p.row]?.[p.col] || '').join('');
    const match = wordsToFind.value.find(w => w === word);

    if (match && !foundWords.value.includes(word)) {
        wordsColor.value[match] = selectionColor.value;
        foundWordsData.value.push({ word: match, coords: [...selection.value] });
        foundWords.value.push(match);
        hintedCell.value = null;

        const isCompleted = foundWords.value.length === wordsToFind.value.length;
        await saveProgress(isCompleted);
        
        if (isCompleted) {
            await gameStore.updateUserStats(puzzleCoins.value, puzzleXp.value);
            showPuzzleDone.value = true;
        }
    }
    selection.value = [];
};

async function showHint() {
    if (userStore.coins >= hintCost.value) {
        await gameStore.updateUserStats(-hintCost.value, 0); 
        
        showCoinsDeducted.value = true;
        setTimeout(() => showCoinsDeducted.value = false, 1500);
        
        const unfound = allWordsData.value.filter(w => !foundWords.value.includes(w.word));
        if (unfound.length > 0) hintedCell.value = unfound[Math.floor(Math.random() * unfound.length)].coords[0];
    } else { 
        import('vue3-toastify').then(({toast}) => toast.error("Not enough coins!")); 
    }
}

function nextStage() {
    if (currentStage.value < maxStage.value) { 
        currentStage.value++; 
        loadStage(currentStage.value); 
    } else { 
        showCategoryDone.value = true; 
    }
}

function goBack() { router.back(); }

onMounted(async () => {
    if (!userStore.currentUser) {
        await userStore.fetchUser();
    }
    await loadData();
});
</script>