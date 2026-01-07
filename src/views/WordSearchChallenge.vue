<template>
    <div class="background-container">
        <div class="container">
            <WordSearchHeader 
                :userCoins="userCoins" 
                :userAvatar="userAvatar" 
                :dropdownActive="dropdownActive"
                @toggleDropdown="dropdownActive = !dropdownActive"
                @closeDropdown="dropdownActive = false"
            />

            <div class="text-container">
                <h2>{{ categoryName }}</h2>
                <p class="bigger">{{ timeString }}</p>
                <p class="smaller">Found {{ foundWords.length }} / {{ wordsToFind.length }}</p>
            </div>

            <div class="wrapper-search">
                <WordSearchList 
                    :wordsToFind="wordsToFind" 
                    :foundWords="foundWords" 
                    :twoColumns="true" 
                />
    
                <WordSearchGrid 
                    :grid="grid"
                    :selection="selection"
                    :selectionColor="selectionColor"
                    :foundWordsData="foundWordsData"
                    :wordsColor="wordsColor"
                    @start="handleStart"
                    @extend="handleExtend"
                    @end="handleEnd"
                />
            </div>

            <div class="bottom">
                <img @click="goBack" src="../assets/home-icon.svg" alt="home icon">
                <img @click="pauseGame" src="../assets/pause-icon.svg" alt="pause icon">
            </div>

            <div class="challenge-paused" v-if="isChallengePaused">
                <h2>Game paused</h2>
                <div class="paused-txt">
                    <p>Want to continue?</p>
                    <div class="btns">
                        <button @click="resumeGame" class="continue-btn">Continue</button>
                    </div>
                </div>
                <div class="paused-txt second">
                    <p>Go back to challenges.</p>
                    <div class="btns">
                        <button @click="goBack">Back</button>
                    </div>
                    <p class="warning">All progress will be lost!</p>
                </div>
           </div>

            <div class="challenge-completed" v-if="isChallengeCompleted">
                <h2>{{ completionTitle }}</h2>
                <div class="results">
                    <div class="stars">
                        <img v-for="(star, index) in starsArray" :key="index" :src="require(`@/assets/${star}`)" alt="star">
                    </div>
                    <p>Record: <span>{{ timeString }}</span></p>
                </div>
                <div class="rewards-txt">
                    <div class="txt-icon">
                        <p>+ {{ puzzleCoinsValue }} coins</p>
                        <img src="../assets/coin-icon.svg" alt="coin icon">
                    </div>
                    <div class="txt-icon">
                        <p>+ {{ puzzleXpValue }} exp</p>
                        <img src="../assets/exp-icon.svg" alt="exp icon">
                    </div>
                </div>
                <div class="btns">
                    <button @click="goBack">Back</button>
                    <button @click="playAgain" class="again-btn">Play again</button>
                </div>
            </div>

            <div class="before-game" v-if="!isGameStarted">
                <h2>Ready to play?</h2>
                <div class="before-txt">
                    <p>Find all given words within time limit to win.</p>
                    <p>Words may appear horizontally, vertically and diagonally, forwards and backwards.</p>
                    <div class="btns">
                        <button @click="goBack">Back</button>
                        <button class="play-btn" @click="startGame">Play</button>
                    </div>
                </div>
           </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { databases, account } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';
import { useWordSearch } from '@/composables/useWordSearch';
import WordSearchHeader from '@/components/WordSearchHeader.vue';
import WordSearchList from '@/components/WordSearchList.vue';
import WordSearchGrid from '@/components/WordSearchGrid.vue';

const route = useRoute();
const router = useRouter();

//logic for word search
const { 
    grid, selection, isSelecting, startCell, selectionColor, 
    wordsColor, foundWordsData, generateGrid 
} = useWordSearch(14);

//game
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

//logic for databse
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_CHALLENGE_ID;
const collection_user_id = process.env.VUE_APP_COLLECTION_ID;
const collection_progress_id = process.env.VUE_APP_COLLECTION_PROGRESS_CHALLENGE_ID;
const collection_user_stats_id = process.env.VUE_APP_COLLECTION_USER_STATS_ID;

const userAvatar = ref('');
const userCoins = ref(0);
const puzzleXp = ref(0);
const puzzleCoins = ref(0);
const puzzleXpValue = ref(0);
const puzzleCoinsValue = ref(0);
const canInteract = computed(() => isGameStarted.value && !isChallengePaused.value && !isChallengeCompleted.value);

//results
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
            await getUserStats(puzzleXp.value, puzzleCoins.value);
            isChallengeCompleted.value = true;
            localStorage.removeItem('challenge-progress');
            await saveProgress();
        } else {
            saveGame();
        }
    }
    selection.value = [];
};

async function loadData() {
    const data = await databases.listDocuments(database_id, collection_id, [Query.equal("title", category)]);
    if (data.total > 0) {
        puzzleXp.value = data.documents[0].xp;
        puzzleCoins.value = data.documents[0].coin;
        wordsToFind.value = data.documents[0].searchWord.sort((a, b) => a.localeCompare(b));
        if (grid.value.length === 0) generateGrid(wordsToFind.value);
    }
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
    try {
        const user = await account.get();
        const challenge_data = { best_time: time.value, stars: starsCount.value };
        const data = await databases.listDocuments(database_id, collection_progress_id, [Query.equal('user_id', user.$id), Query.equal('category', category)]);

        if (data.documents.length > 0) {
            const doc = data.documents[0];
            const currentBest = JSON.parse(doc.challenge_data);
            if (time.value < currentBest.best_time) {
                await databases.updateDocument(database_id, collection_progress_id, doc.$id, { challenge_data: JSON.stringify(challenge_data) });
            }
        } else {
            await databases.createDocument(database_id, collection_progress_id, ID.unique(), { user_id: user.$id, category, challenge_data: JSON.stringify(challenge_data) });
        }
    } catch (err) { console.error(err); }
}

async function getUserStats(coins, xp) {
    try {
        const user = await account.get();
        const stats = await databases.listDocuments(database_id, collection_user_stats_id, [Query.equal('user_id', user.$id)]);
        if (stats.total > 0) {
            const doc = stats.documents[0];
            const mult = starsCount.value === 3 ? 1 : starsCount.value === 2 ? 0.5 : 0.25;
            puzzleCoinsValue.value = Math.floor(coins * mult);
            puzzleXpValue.value = Math.floor(xp * mult);
            await databases.updateDocument(database_id, collection_user_stats_id, doc.$id, {
                coin: doc.coin + puzzleCoinsValue.value,
                xp: doc.xp + puzzleXpValue.value
            });
        }
    } catch (err) { console.error(err); }
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
    const user = await account.get();
    const avatarData = await databases.listDocuments(database_id, collection_user_id, [Query.equal('id_user', user.$id)]);
    if (avatarData.total > 0) userAvatar.value = avatarData.documents[0].avatar;
    const statsData = await databases.listDocuments(database_id, collection_user_stats_id, [Query.equal('user_id', user.$id)]);
    if (statsData.total > 0) userCoins.value = statsData.documents[0].coin;
});
</script>

<style lang="scss" scoped>
.background-container { background-color: rgb(174, 210, 229); width: 100vw; height: 100vh; }
.container { display: flex; align-items: center; flex-direction: column; position: relative; padding-bottom: 50px; }
.text-container { text-align: center; margin-top: 4px; h2 { font-size: 56px; margin: 0; } .bigger { font-size: 32px; font-weight: 500; } }
.wrapper-search { display: flex; justify-content: center; gap: 48px; margin-top: 20px; }
.bottom { display: flex; justify-content: center; align-items: center; margin-top: 32px; background-color: #57A4CD; width: 280px; border: 4px solid black; border-radius: 24px; gap: 24px; img { width: 44px; cursor: pointer; } }

.challenge-paused, .before-game, .challenge-completed { 
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
    width: 540px; min-height: 420px; background-color: rgba(113, 172, 204,0.6); 
    backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; 
    flex-direction: column; border-radius: 6px; z-index: 100;
}

h2 { font-size: 54px; font-weight: 500; text-align: center; margin-bottom: 24px; }
.paused-txt, .before-txt { display: flex; flex-direction: column; gap: 16px; p { font-size: 28px; text-align: center; } }
.btns { display: flex; gap: 64px; justify-content: center; margin-top: 24px; 
    button { font-size: 24px; padding: 10px 40px; border-radius: 6px; cursor: pointer; border: 2px solid black; background: #f9f9f9; transition: 0.3s;
        &:hover { transform: scale(1.1); box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86); }
    }
    .play-btn, .continue-btn, .again-btn { background-color: #71ACCC; }
}

.stars img { width: 80px; margin: 0 5px; }
.results p { font-size: 24px; margin-top: 10px; span { font-weight: 500; } }
.rewards-txt { display: flex; gap: 64px; font-size: 24px; margin: 20px 0; 
    .txt-icon { display: flex; align-items: center; gap: 8px; img { width: 48px; } }
}

@media (max-width: 600px) {
    .wrapper-search { flex-direction: column; align-items: center; gap: 20px; }
    .challenge-paused, .before-game, .challenge-completed { width: 90%; min-height: auto; padding: 20px; }
    h2 { font-size: 32px; }
}
</style>