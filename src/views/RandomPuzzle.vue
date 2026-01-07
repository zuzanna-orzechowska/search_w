<template>
    <div class="background-container">
        <div class="container">
            <div class="text-container">
                <h2>{{ categoryName }}</h2>
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
                <img @click="showHint" src="../assets/hint-icon.svg" alt="hint icon">
            </div>

            <div class="category-done" v-if="showCreateAccount">
                <h2>No more random puzzles 😔</h2>
                <p>Please sign in to save your progress and unlock more!</p>
                <div class="btns">
                    <button @click="goBack">Back</button>
                    <button @click="router.push('/login')">Sign in</button>
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

<style lang="scss" scoped>
.background-container {
    width: 100vw; height: 100vh;
    background-color: rgb(174, 210, 229);
}

.container {
    background-color: rgb(174, 210, 229);
    display: flex; align-items: center;
    flex-direction: column; position: relative;
    height: 100vh; overflow-y: scroll;

    .text-container {
        text-align: center; margin-top: 12px;
        h2 { font-size: 56px; margin-bottom: 4px; }
        .smaller { font-size: 28px; margin-bottom: 32px; }
    }

    .wrapper-search { display: flex; justify-content: center; gap: 96px; }

    .bottom {
        display: flex; justify-content: center; align-items: center;
        margin-top: 32px; background-color: #57A4CD;
        width: 280px; border: 4px solid black; border-radius: 24px; gap: 24px;
        img { width: 44px; cursor: pointer; }
    }

    .category-done {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 696px; height: 496px; background-color: rgba(113, 172, 204, 0.6);
        backdrop-filter: blur(10px); border-radius: 6px;
        display: flex; align-items: center; justify-content: center; flex-direction: column;
        z-index: 100;

        h2 { font-size: 54px; font-weight: 500; text-align: center; margin-bottom: 24px; }
        p { font-size: 28px; text-align: center; }
        .btns {
            display: flex; gap: 64px; margin-top: 24px;
            button {
                font-size: 24px; padding: 10px 40px; border-radius: 6px; cursor: pointer; border: 2px solid black;
                &:hover { transform: scale(1.1); box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86); }
            }
        }
    }
}

@media (max-width: 600px) {
    .container {
        .text-container h2 { font-size: 36px; }
        .wrapper-search { flex-direction: column; align-items: center; gap: 24px; }
        .category-done { width: 90%; height: auto; padding: 30px 20px; h2 { font-size: 32px; } p { font-size: 18px; } }
    }
}
</style>