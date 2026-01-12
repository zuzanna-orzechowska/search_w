<template>
    <div class="h-screen w-screen overflow-y-auto bg-[#aed2e5]">
        <div class="relative flex flex-col items-center bg-[#aed2e5] pb-[50px] px-4">
            <WordSearchHeader :userCoins="userStore.coins" :userAvatar="userStore.avatar" :dropdownActive="dropdownActive" @toggleDropdown="dropdownActive = !dropdownActive" @closeDropdown="dropdownActive = false"/>

            <div class="mt-1 text-center">
                <h2 class="m-0 text-[36px] min-[601px]:text-[56px] font-bold">{{ categoryName }}</h2>
                <p class="text-[32px] font-medium">{{ timeString }}</p>
                <p class="text-[20px]">Found {{ foundWords.length }} / {{ wordsToFind.length }}</p>
            </div>

            <div class="mt-5 flex flex-col items-center gap-8 min-[992px]:flex-row min-[992px]:items-start min-[992px]:justify-center w-full max-w-5xl">
                
                <div class="w-full min-[992px]:w-1/3 max-w-[350px]">
                    <WordSearchList :wordsToFind="wordsToFind" :foundWords="foundWords" :twoColumns="true" />
                </div>
    
                <div class="w-full max-w-[90vw] min-[992px]:max-w-[600px] lg:max-w-[600px]">
                    <WordSearchGrid :grid="grid" :selection="selection" :selectionColor="selectionColor" :foundWordsData="foundWordsData" :wordsColor="wordsColor"
                        @start="handleStart" @extend="handleExtend" @end="handleEnd"/>
                </div>
            </div>

            <div class="mt-8 flex w-[280px] items-center justify-center gap-6 rounded-[24px] border-4 border-black bg-[#57A4CD] py-2">
                <img @click="goBack" src="../assets/home-icon.svg" alt="home icon" class="w-[44px] cursor-pointer">
                <img @click="pauseGame" src="../assets/pause-icon.svg" alt="pause icon" class="w-[44px] cursor-pointer">
            </div>

            <div v-if="isChallengePaused" class="absolute left-1/2 top-1/2 z-[100] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md bg-[#71accc]/60 p-10 text-center backdrop-blur-md w-[90%] max-w-[540px] border-2 border-black/10">
                <h2 class="text-[40px] min-[601px]:text-[54px] font-bold mb-6">Game paused</h2>
                <div class="flex flex-col gap-4">
                    <p class="text-[28px]">Want to continue?</p>
                    <div class="flex justify-center mb-6">
                        <button @click="resumeGame" class="rounded-md border-2 border-black bg-[#71ACCC] px-10 py-2 text-[24px] cursor-pointer transition-transform hover:scale-110">Continue</button>
                    </div>
                </div>
                <div class="flex flex-col gap-4 border-t border-black/20 pt-6">
                    <p class="text-[28px]">Go back to challenges.</p>
                    <div class="flex justify-center">
                        <button @click="goBack" class="rounded-md border-2 border-black bg-white px-10 py-2 text-[24px] cursor-pointer transition-transform hover:scale-110">Back</button>
                    </div>
                    <p class="text-red-600 font-bold uppercase tracking-wider">All progress will be lost!</p>
                </div>
           </div>

            <div v-if="isChallengeCompleted" class="absolute left-1/2 top-1/2 z-[100] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md bg-[#71accc]/60 p-10 text-center backdrop-blur-md w-[90%] max-w-[540px] border-2 border-black/10">
                <h2 class="text-[40px] min-[601px]:text-[54px] font-bold mb-6">{{ completionTitle }}</h2>
                <div class="flex flex-col items-center">
                    <div class="flex justify-center gap-2 mb-4">
                        <img v-for="(star, index) in starsArray" :key="index" :src="require(`@/assets/${star}`)" alt="star" class="w-20">
                    </div>
                    <p class="text-[24px]">Record: <span class="font-bold">{{ timeString }}</span></p>
                </div>
                <div class="flex justify-center gap-8 min-[601px]:gap-[64px] text-[24px] my-6">
                    <div class="flex items-center gap-2">
                        <p>+ {{ puzzleCoinsValue }} coins</p>
                        <img src="../assets/coin-icon.svg" alt="coin icon" class="w-12">
                    </div>
                    <div class="flex items-center gap-2">
                        <p>+ {{ puzzleXpValue }} exp</p>
                        <img src="../assets/exp-icon.svg" alt="exp icon" class="w-12">
                    </div>
                </div>
                <div class="flex justify-center gap-8">
                    <button @click="goBack" class="rounded-md border-2 border-black bg-white px-10 py-2 text-[24px] cursor-pointer transition-transform hover:scale-110">Back</button>
                    <button @click="playAgain" class="rounded-md border-2 border-black bg-[#71ACCC] px-10 py-2 text-[24px] cursor-pointer transition-transform hover:scale-110">Play again</button>
                </div>
            </div>

            <div v-if="!isGameStarted" class="absolute left-1/2 top-1/2 z-[100] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md bg-[#71accc]/60 p-10 text-center backdrop-blur-md w-[90%] max-w-[540px] border-2 border-black/10">
                <h2 class="text-[40px] min-[601px]:text-[54px] font-bold mb-6">Ready to play?</h2>
                <div class="flex flex-col gap-4">
                    <p class="text-[24px] min-[601px]:text-[28px]">Find all given words within time limit to win.</p>
                    <p class="text-[18px] min-[601px]:text-[20px] opacity-80 italic">Words may appear horizontally, vertically and diagonally, forwards and backwards.</p>
                    <div class="flex justify-center gap-8 mt-6">
                        <button @click="goBack" class="rounded-md border-2 border-black bg-white px-10 py-2 text-[24px] cursor-pointer transition-transform hover:scale-110">Back</button>
                        <button @click="startGame" class="rounded-md border-2 border-black bg-[#71ACCC] px-10 py-2 text-[24px] cursor-pointer transition-transform hover:scale-110">Play</button>
                    </div>
                </div>
           </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

const { 
    grid, selection, isSelecting, startCell, selectionColor, 
    wordsColor, foundWordsData, generateGrid 
} = useWordSearch(14);

const isChallengePaused = ref(false);
const isChallengeCompleted = ref(false);
const isGameStarted = ref(false);
const time = ref(0);
const timeString = ref('00:00');
const timer = ref(null);
const dropdownActive = ref(false);
const wordsToFind = ref([]);
const category = route.query.category;
const categoryName = ref(category.charAt(0).toUpperCase() + category.slice(1));
const foundWords = ref([]);

const puzzleXp = ref(0);
const puzzleCoins = ref(0);
const puzzleXpValue = ref(0);
const puzzleCoinsValue = ref(0);

const canInteract = computed(() => isGameStarted.value && !isChallengePaused.value && !isChallengeCompleted.value);

const starsCount = computed(() => {
    if (time.value <= 4 * 60) return 3;
    if (time.value <= 6 * 60) return 2;
    if (time.value <= 10 * 60) return 1;
    return 0;
});

const completionTitle = computed(() => {
    if (starsCount.value === 3) return 'Excellent work!';
    if (starsCount.value === 2) return 'Good work!';
    if (starsCount.value === 1) return 'Great!';
    return 'Try again';
});

const starsArray = computed(() => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
        stars.push(i < starsCount.value ? 'full-star.svg' : 'blank-star.svg');
    }
    return stars;
});

const startGame = () => { isGameStarted.value = true; startTimer(); };
const pauseGame = () => { isChallengePaused.value = true; stopTimer(); saveGame(); };
const resumeGame = () => { isChallengePaused.value = false; startTimer(); };

function startTimer() {
    timer.value = setInterval(() => {
        time.value++;
        const mins = Math.floor(time.value / 60).toString().padStart(2, '0');
        const secs = (time.value % 60).toString().padStart(2, '0');
        timeString.value = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() { clearInterval(timer.value); timer.value = null; }

//interacting with grid
const handleStart = (r, c) => {
    if (!canInteract.value) return;
    isSelecting.value = true;
    startCell.value = { row: r, col: c };
    selection.value = [{ row: r, col: c }];
    selectionColor.value = `rgb(${Math.floor(Math.random()*156+50)},${Math.floor(Math.random()*156+50)},${Math.floor(Math.random()*156+50)})`;
};

const handleExtend = (r, c) => {
    if (!isSelecting.value || !startCell.value || !canInteract.value) return;
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

        if (foundWords.value.length === wordsToFind.value.length) {
            stopTimer();
            await applyRewards();
            isChallengeCompleted.value = true;
            localStorage.removeItem('challenge-progress');
            await saveProgress();
        } else {
            saveGame();
        }
    }
    selection.value = [];
};

//logic with game store
async function loadData() {
    const docs = await gameStore.fetchPuzzleData(category, true);
    if (docs.length > 0) {
        puzzleXp.value = docs[0].xp;
        puzzleCoins.value = docs[0].coin;
        wordsToFind.value = docs[0].searchWord.sort((a, b) => a.localeCompare(b));
        if (grid.value.length === 0) generateGrid(wordsToFind.value);
    }
}

async function applyRewards() {
    const mult = starsCount.value === 3 ? 1 : starsCount.value === 2 ? 0.5 : 0.25;
    puzzleCoinsValue.value = Math.floor(puzzleCoins.value * mult);
    puzzleXpValue.value = Math.floor(puzzleXp.value * mult);
    
    await gameStore.updateUserStats(puzzleCoinsValue.value, puzzleXpValue.value);
}

function saveGame() {
    const state = { 
        category, foundWords: foundWords.value, time: time.value, 
        isGameStarted: isGameStarted.value, wordsColor: wordsColor.value, 
        foundWordsData: foundWordsData.value, grid: grid.value 
    };
    localStorage.setItem('challenge-progress', JSON.stringify(state));
}

async function saveProgress() {
    const challengeData = { best_time: time.value, stars: starsCount.value };
    await gameStore.saveChallengeProgress(userStore.currentUser.$id, category, challengeData);
}

function goBack() { localStorage.removeItem('challenge-progress'); router.back(); }

async function playAgain() {
    localStorage.removeItem('challenge-progress');
    isChallengeCompleted.value = false;
    isChallengePaused.value = false;
    isGameStarted.value = false;
    time.value = 0;
    timeString.value = '00:00';
    foundWords.value = [];
    foundWordsData.value = [];
    wordsColor.value = {};
    grid.value = [];
    await loadData();
}

onMounted(async () => {
    if (!userStore.currentUser) {
        await userStore.fetchUser();
    }
    await loadData();
    
    const saved = localStorage.getItem('challenge-progress');
    if (saved) {
        const state = JSON.parse(saved);
        if (state.category === category) {
            foundWords.value = state.foundWords; time.value = state.time;
            isGameStarted.value = state.isGameStarted; wordsColor.value = state.wordsColor;
            foundWordsData.value = state.foundWordsData; grid.value = state.grid;
            isChallengePaused.value = true;
        }
    }
});
</script>