<template>
    <div class="background-container">
        <div class="container">
            <WordSearchHeader 
                :userCoins="userStore.coins" 
                :userAvatar="userStore.avatar" 
                :showCoinsDeducted="showCoinsDeducted" 
                :hintCost="hintCost"
                :dropdownActive="dropdownActive"
                @toggleDropdown="dropdownActive = !dropdownActive"
                @closeDropdown="dropdownActive = false"
            />

            <div class="text-container">
                <h2>{{ categoryName }}</h2>
                <p class="bigger">Stage {{ currentStage }} / {{ maxStage }}</p>
                <p class="smaller">Words may appear horizontally, vertically and diagonally, forwards and backwards.</p>
            </div>

            <div class="wrapper-search">
                <WordSearchList 
                    :wordsToFind="wordsToFind" 
                    :foundWords="foundWords" 
                />
    
                <WordSearchGrid 
                    :grid="grid"
                    :selection="selection"
                    :selectionColor="selectionColor"
                    :foundWordsData="foundWordsData"
                    :wordsColor="wordsColor"
                    :hintedCell="hintedCell"
                    @start="handleStart"
                    @extend="handleExtend"
                    @end="handleEnd"
                />
            </div>

            <div class="bottom">
                <img @click="goBack" src="../assets/home-icon.svg" alt="home icon">
                <div class="hint-wrapper">
                    <span class="hint-cost-text" v-if="showHintCost">{{ hintCost }}</span>
                    <img @click="showHint" @mouseover="showHintCost = true" @mouseleave="showHintCost = false" src="../assets/hint-icon.svg" alt="hint icon">
                </div>
            </div>

            <div class="puzzle-done" v-if="showPuzzleDone">
                <h2>Puzzle completed!</h2>
                <div class="rewards-txt">
                    <div class="txt-icon">
                        <p>+ {{ puzzleCoins }} coins</p>
                        <img src="../assets/coin-icon.svg" alt="coin icon">
                    </div>
                    <div class="txt-icon">
                        <p>+ {{ puzzleXp }} exp</p>
                        <img src="../assets/exp-icon.svg" alt="exp icon">
                    </div>
                </div>
                <div class="btns">
                    <button @click="goBack">Back</button>
                    <button class="next-btn" @click="nextStage">Next</button>
                </div>
            </div>

            <div class="category-done" v-if="showCategoryDone">
                <h2>Congratulations!</h2>
                <p>You've completed all puzzles in this category</p>
                <img src="../assets/blueFluff.svg" alt="blue fluff">
                <div class="btns">
                    <button @click="goBack">Back</button>
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

<style lang="scss" scoped>
.background-container { width: 100vw; height: 100vh; background-color: rgb(174, 210, 229); overflow-y: scroll; }
.container { background-color: rgb(174, 210, 229); display: flex; align-items: center; flex-direction: column; position: relative; padding-bottom: 50px; }
.text-container { text-align: center; margin-top: 4px; h2 { font-size: 56px; margin: 0; } .bigger { font-size: 32px; } .smaller { font-size: 20px; } }
.wrapper-search { display: flex; justify-content: center; gap: 96px; margin-top: 20px; }
.bottom { display: flex; justify-content: center; align-items: center; margin-top: 32px; background-color: #57A4CD; width: 280px; border: 4px solid black; border-radius: 24px; gap: 24px; img { width: 44px; cursor: pointer; } }

.puzzle-done, .category-done { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(113, 172, 204, 0.8); backdrop-filter: blur(10px); padding: 40px; border-radius: 12px; text-align: center; z-index: 100;
    h2 { font-size: 54px; } .rewards-txt { display: flex; gap: 64px; justify-content: center; font-size: 24px; } .btns { display: flex; gap: 64px; justify-content: center; margin-top: 20px; }
    button { font-size: 24px; padding: 10px 40px; border-radius: 6px; cursor: pointer; border: 2px solid black; } .next-btn { background: #71ACCC; }
}

.hint-wrapper { position: relative; .hint-cost-text { position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%); background: #f9f9f9; padding: 4px 8px; border-radius: 4px; font-weight: bold; } }

@media (max-width: 600px) {
    .wrapper-search { flex-direction: column; align-items: center; gap: 20px; }
    .text-container h2 { font-size: 36px; }
}
</style>