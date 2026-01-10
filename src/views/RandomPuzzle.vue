<template>
    <div class="h-screen w-screen bg-[#aed2e5] overflow-hidden">
        <div class="relative flex flex-col items-center bg-[#aed2e5] h-screen overflow-y-auto pb-[50px] px-4">
            
            <div class="mt-3 text-center">
                <h2 class="m-0 text-[36px] min-[601px]:text-[56px] font-bold">{{ categoryName }}</h2>
                <p class="text-[20px] min-[601px]:text-[28px] mb-8">Words may appear horizontally, vertically and diagonally, forwards and backwards.</p>
            </div>

            <div class="flex flex-col min-[992px]:flex-row items-center min-[992px]:items-start justify-center gap-8 w-full max-w-[1200px] mx-auto">
                
                <div class="w-full min-[992px]:w-1/4 max-w-[300px]">
                    <WordSearchList 
                        :wordsToFind="wordsToFind" 
                        :foundWords="foundWords" 
                    />
                </div>
    
                <div class="w-full max-w-[550px] flex justify-center">
                    <WordSearchGrid :grid="grid" :selection="selection" :selectionColor="selectionColor" :foundWordsData="foundWordsData" :wordsColor="wordsColor" :hintedCell="hintedCell"
                        @start="handleStart" @extend="handleExtend" @end="handleEnd"/>
                </div>
            </div>

            <div class="mt-8 flex w-[280px] items-center justify-center gap-6 rounded-[24px] border-4 border-black bg-[#57A4CD] py-2">
                <img @click="goBack" src="../assets/home-icon.svg" alt="home icon" class="w-[44px] cursor-pointer">
                <img @click="showHint" src="../assets/hint-icon.svg" alt="hint icon" class="w-[44px] cursor-pointer">
            </div>

            <div v-if="showCreateAccount" class="absolute left-1/2 top-1/2 z-[100] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md bg-[#71accc]/60 p-8 text-center backdrop-blur-md w-[90%] max-w-[696px] min-h-[400px]">
                <h2 class="text-[32px] min-[601px]:text-[54px] font-medium leading-tight mb-6">No more random puzzles 😔</h2>
                <p class="text-[18px] min-[601px]:text-[28px] mb-8">Please sign in to save your progress and unlock more!</p>
                <div class="flex flex-wrap justify-center gap-8 md:gap-[64px]">
                    <button @click="goBack" class="rounded-md border-2 border-black bg-white px-10 py-2 text-[24px] cursor-pointer transition-transform hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)]">
                        Back
                    </button>
                    <button @click="router.push('/login')" class="rounded-md border-2 border-black bg-[#3291C3] px-10 py-2 text-[24px] cursor-pointer transition-transform hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)]">
                        Sign in
                    </button>
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
import WordSearchList from '@/components/WordSearchList.vue';
import WordSearchGrid from '@/components/WordSearchGrid.vue';

const route = useRoute();
const router = useRouter();

//logic of word search
const { 
    grid, selection, isSelecting, startCell, selectionColor, 
    wordsColor, foundWordsData, allWordsData, generateGrid 
} = useWordSearch(12);

const wordsToFind = ref([]);
const category = route.query.category;
const categoryName = ref(category.charAt(0).toUpperCase() + category.slice(1));
const foundWords = ref([]);
const hintedCell = ref(null);
const showCreateAccount = ref(false);

const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_PLAY_ID;

//logic for database
async function loadData() {
    try {
        const puzzlesData = await databases.listDocuments(database_id, collection_id, [Query.equal("title", category)]);
        if (puzzlesData.total === 0) {
            console.log("Error, couldn't find category", category);
            return;
        }
        wordsToFind.value = puzzlesData.documents[0].searchWord;
        generateGrid(wordsToFind.value);
    } catch (err) {
        console.log("Error:", err);
    }
}

//interacting with grid
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

const handleEnd = () => {
    if (!isSelecting.value) return;
    isSelecting.value = false;
    
    const word = selection.value.map(p => grid.value[p.row]?.[p.col] || '').join('');
    const match = wordsToFind.value.find(w => w === word);

    if (match && !foundWords.value.includes(word)) {
        wordsColor.value[match] = selectionColor.value;
        foundWordsData.value.push({ word: match, coords: [...selection.value] });
        foundWords.value.push(match);
        hintedCell.value = null;

        if (foundWords.value.length === wordsToFind.value.length) {
            showCreateAccount.value = true;
            onComplete();
        }
    }
    selection.value = [];
};

function showHint() {
    const unfoundWords = allWordsData.value.filter(wordData => !foundWords.value.includes(wordData.word));
    if (unfoundWords.length > 0) {
        hintedCell.value = unfoundWords[Math.floor(Math.random() * unfoundWords.length)].coords[0];
    }
}

function onComplete() {
    localStorage.setItem('guestProgress', 1);
}

function goBack() {
    router.back();
}

onMounted(async () => {
   await loadData();
});
</script>