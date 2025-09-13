<template>
    <div class="background-container">
        <div class="container">
            <div class="right-up-wrapper">
                <div class="coins-display">
                    <img src="../assets/coin-icon.svg" alt="Coins">
                    <p>{{ userCoins }}</p>
                </div>
                <div class="coins-deducted" v-if="showCoinsDeducted">
                    <p>-{{ hintCost }}</p>
                    <img src="../assets/coin-icon.svg" alt="Coin deducted">
                </div>
                <div class="avatar-wrapper">
                    <img :src="userAvatar" alt="User Avatar" class="user-avatar" />
                </div>
            </div>
            <div class="text-container">
                <h2>{{ categoryName }}</h2>
                <p class="bigger">Stage {{ currentStage }} / {{ maxStage }}</p>
                <p class="smaller">Words may appear horizontally, vertically and diagonally, forwards and backwards.</p>
            </div>
            <div class="wrapper-search">
                <div class="words-list">
                    <h4>Words to find:</h4>
                    <ul>
                        <li :class="{foundWord : foundWords.includes(word)}" v-for="(word,ind) in wordsToFind" :key="ind">{{ word }}</li>
                    </ul>
                </div>
    
                <div class="grid">
                    <!--2D array-->
                    <div class="row" v-for="(row,indRow) in grid" :key="indRow">
                        <!--getCellClass takes coordinates of a letter and gives it proper class - selected or found
                        mousedown - mouse is clicked, .prevent prevents default behavior like selecting text, mouseover when clicked mouse is being drag across letter
                        mouseup when user stops clicking mouse
                        .some checks if at least one element in the array passes the test-->
                        <span class="cell" v-for="(cell, indCell) in row" :key="indCell" 
                        :style="getCellStyle(indRow, indCell)"
                        @mousedown.prevent="startSelection(indRow, indCell)" @mouseover="extendSelection(indRow, indCell)" @mouseup="endSelection">
                        {{ cell }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="bottom">
                <img @click="goBack" src="../assets/home-icon.svg" alt="home icon">
                <div class="hint-wrapper">
                    <span class="hint-cost-text" v-if="showHintCost">
                        {{ hintCost }}
                    </span>
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
//imports
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { databases, account } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';
import { toast } from 'vue3-toastify';

//all variables
//global variables
const route = useRoute();
const router = useRouter();

//variables related to word search 
const wordsToFind = ref([]);
const grid = ref([]); //blank array
const gridSize = 12;
const category = route.query.category; //query parameters in URL adress -< /ws?category=fruit
const categoryName = ref('');
categoryName.value = category.charAt(0).toUpperCase()+category.slice(1);
const foundWords = ref([]);
const selection = ref([]); //letters that are selected - its' coordinates x,y
const isSelecting = ref(false); //does user is selecting letter with clicked mouse
const startCell = ref(null); //first letter from selected word
const selectionColor = ref(null) // current color of selecting letter
const wordsColor = ref({}); //which word has which color
const foundWordsData = ref([]) //info of found - value of word and it's cords
const hintedCell = ref()// {row,col} will be stored here

//variables related to database
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_PLAY_ID;
const collection_user_id = process.env.VUE_APP_COLLECTION_ID;
const collection_progress_id = process.env.VUE_APP_COLLECTION_PROGRESS_PLAY_ID;
const collection_user_stats_id = process.env.VUE_APP_COLLECTION_USER_STATS_ID;
let currentStage = ref(1);
let maxStage = ref();
const username = ref('');
const userAvatar = ref('');
let userCoins = ref(0);
const showPuzzleDone = ref(false);
const showCategoryDone = ref(false);
let currentUser = ref(null); //needed for saving progress for currently logged in user
let progressDocumentId = null; // storing the ID of the single progress document
let progressData = {}; // storing the entire stages_data object
const puzzleXp = ref(0);
const puzzleCoins = ref(0);
const hintCost = ref(20); //cost of using a hint;
const showHintCost = ref(false);
const showCoinsDeducted = ref(false);


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

async function loadStage(stage) {
    try {
        const stageDoc = await findStagePuzzle(stage); // Find the original puzzle data
        if (!stageDoc) {
            console.log("Stage not found:", stage);
            return;
        }

        //loading xp and coins value from current stage
        puzzleXp.value = stageDoc.xp;
        puzzleCoins.value = stageDoc.coin;

        //sorting words A-Z
        const sortedWords = stageDoc.searchWord;
        sortedWords.sort((a, b) => a.localeCompare(b));
        wordsToFind.value = sortedWords;

        currentStage.value = stage;

        const stageProgress = progressData[stage];
        if (stageProgress) {
            //loading progress from the single document
            foundWords.value = stageProgress.foundWords || [];
            foundWordsData.value = JSON.parse(stageProgress.foundWordsData || '[]');
            wordsColor.value = JSON.parse(stageProgress.wordsColor || '{}');
            grid.value = JSON.parse(stageProgress.grid || '[]');
            showPuzzleDone.value = stageProgress.completed || false;
        } else {
            //if it's new stage, reset everything
            foundWords.value = [];
            foundWordsData.value = [];
            wordsColor.value = {};
            grid.value = [];
            showPuzzleDone.value = false;
        }

        if (grid.value.length === 0) generateGrid();
    } catch (err) {
        console.log("Error loading stage:", err);
    }
}

async function findStagePuzzle(stage) {
    //optimized query to only fetch documents for the specific category
    const data = await databases.listDocuments(database_id, collection_id, [Query.equal("title", category)]);

    //filter the fetched documents to find the specific stage
    return data.documents.find(doc => parseInt(doc.puzzleId.split('-')[1]) === stage);
}

async function loadData() {
    try {
        //finding max stage from original puzzle collection
        const puzzlesData = await databases.listDocuments(database_id, collection_id, [Query.equal("title", category)]);
        if (puzzlesData.total === 0) {
            console.log("Error, couldn't find category", category);
            return;
        }

        const stages = puzzlesData.documents.map(doc => parseInt(doc.puzzleId.split('-')[1]));
        maxStage.value = Math.max(...stages);
        
        //loading or create the single progress document
        await loadProgressDocument();
        
        loadStage(currentStage.value);
    } catch (err) {
        console.log("Error:", err);
    }
}

async function loadProgressDocument() {
    const progressDocs = await databases.listDocuments(
        database_id,
        collection_progress_id,
        [Query.equal("user_id", currentUser.value.$id), Query.equal("category", category)]
    );

    if (progressDocs.total > 0) {
        //if document exists, load its data
        const doc = progressDocs.documents[0];
        progressDocumentId = doc.$id;
        progressData = JSON.parse(doc.stages_data);
        currentStage.value = progressData.maxStage || 1; //loading the highest stage reached
    } else {
        //if document does not exist, create it
        const newDoc = await databases.createDocument(
            database_id,
            collection_progress_id,
            ID.unique(),
            {user_id: currentUser.value.$id, category,stages_data: '{}'});
        progressDocumentId = newDoc.$id;
        progressData = {};
        currentStage.value = 1;
    }
}

async function saveProgress(completed = false) {
    const puzzleId = `${category}-${currentStage.value}`;

    //updating the progressData object for the current stage
    progressData[currentStage.value] = {
        completed,
        puzzleId,
        foundWords: foundWords.value,
        foundWordsData: JSON.stringify(foundWordsData.value),
        grid: JSON.stringify(grid.value),
        wordsColor: JSON.stringify(wordsColor.value),
    };
    
    //updating the max stage if the current stage is higher
    progressData.maxStage = Math.max(progressData.maxStage || 0, currentStage.value);

    //saving the entire updated stages_data to the single document
    await databases.updateDocument(database_id, collection_progress_id, progressDocumentId, { stages_data: JSON.stringify(progressData) });
}

//saving progress to current user stats
async function getUserStats(coins, xp) {
    try {
        //const user = await account.get();
        const userStats = await databases.listDocuments(database_id, collection_user_stats_id, [Query.equal('user_id', currentUser.value.$id)]);

        if (userStats.total > 0) {
            const doc = userStats.documents[0];
            const coinsAmmount = doc.coin + coins;
            const xpAmmount = doc.xp + xp;

            await databases.updateDocument(database_id, collection_user_stats_id, doc.$id, {
                coin: coinsAmmount,
                xp: xpAmmount
            });
            //console.log("User stats updated successfully!");
        } else {
            //if it's user's first xp and coins
            await databases.createDocument(database_id, collection_user_stats_id, ID.unique(), {
                user_id: currentUser.value.$id,
                coin: coins,
                xp: xp
            });
            //console.log("New user stats document created successfully!");
        }
    } catch (err) {
        console.error("Error user stats: ", err);
    }
}

async function getUserAvatar () {
    try {
        const userId = currentUser.value.$id;
        username.value = currentUser.value.name;

        //searching user by id to find avatar src
        //Query is a class that lets use methods for each type of supported query operation, for example searching if given value is in database (method equal)
        const searchedUser = await databases.listDocuments(database_id,collection_user_id, [Query.equal('id_user',userId)]);

        if(searchedUser.total > 0) { //checking if databse return any document
            const userDocuments = searchedUser.documents[0]; //given value from first document is assigned to userDocuments variable, so we can get avatar value from it
            userAvatar.value = userDocuments.avatar;
            //console.log("Img src: ",userAvatar.value);
        }
    } catch(err) {
        console.log("Error: ",err);
    }
}

async function getUserCoins () {
    try {
        const userStats = await databases.listDocuments(database_id, collection_user_stats_id, [Query.equal('user_id', currentUser.value.$id)]);

        if (userStats.total > 0) {
            const doc = userStats.documents[0];
            userCoins.value = doc.coin;
            //console.log("User stats updated successfully!");
        } else {
            console.log("Couldn't fetch coins");
        }
    } catch (err) {
        console.log("Error in getting coins:",err);
    }
}

async function hintPayment(amount) {
    try {
        if (!currentUser.value) {
            await getUser();
        }
        
        const userStats = await databases.listDocuments(database_id, collection_user_stats_id, [Query.equal('user_id', currentUser.value.$id)]);
        
        if (userStats.total > 0) {
            const doc = userStats.documents[0];
            const currentCoins = doc.coin;
            
            if (currentCoins >= amount) {
                const newCoinAmount = currentCoins - amount;
                await databases.updateDocument(database_id, collection_user_stats_id, doc.$id, {
                    coin: newCoinAmount,
                });
                return true; //payment was successful
            } else if(currentCoins < amount) {
                toast.error("Not enough coins to buy a hint!");
            }
        }
        return false; //payment failed (not enough coins or document not found)
    } catch (err) {
        console.error("Error processing hint payment:", err);
        return false;
    }
}

//function related to word search - creating grid, color
function generateGrid() {
    let allWordsPlaced = false; //flag for checking if all of the words was placed 

    while (!allWordsPlaced) {
        const temp = Array.from({length: gridSize}, () => Array(gridSize).fill("")); //creating copy of grid array - size of 12, and filling it with blank strings, 
        //Array.from creates new copied Array from array-like object, namely grid
        //8 directions of words placement - horizontally: x=1,y=0 / x=-1,0 (backwards), 
        //vertically: x=0,y=1 / x=0,y=-1 (backwards), 
        //diagonally: x=1,y=1 (down-rigth) / x=-1,y=-1 (up-left) /  x=-1,y=1 (down-left) / x=1,y=-1 (down-right)
        const directions = [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}, {x:1,y:1},{x:-1,y:-1},{x:-1,y:1},{x:1,y:-1}];
        
        const sortedWords = [...wordsToFind.value].sort((a, b) => b.length - a.length); //sorting words in form longest to shortest, so the longest will be placed first
        let success = true; //if word was successfuly placed

        for (const word of sortedWords) {
            if (!placeWord(word.toUpperCase(), temp, directions, gridSize)) {
                success = false;
                break;
            }
        }

        if (success) { //if all words was placed then fill rest of the grid with random letters
            const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for(let i = 0; i < gridSize; i++) {
                for(let j = 0; j < gridSize; j++) {
                    if(temp[j][i] === '') {
                        temp[j][i] = letter[Math.floor(Math.random()*letter.length)];
                    }
                }
            }
            grid.value = temp;
            allWordsPlaced = true;
        }
    }
}

function doesWordFits(word, startX, startY, direction, tempGrid, gridSize) {
    //firstly we need to calculate end of the word, using it's length
    const endX = startX + direction.x * (word.length - 1); //first letter is in starting position that's why word.length-1
    const endY = startY + direction.y * (word.length - 1);

    if (endX >= gridSize || endY >= gridSize || endX < 0 || endY < 0) return false;

    //checking if it's a letter coliision - if yes then given letter is shared
    for (let i = 0; i < word.length; i++) {
        const x = startX + direction.x * i;
        const y = startY + direction.y * i;
        //accessing the grid from the passed argument
        if (tempGrid[y][x] !== '' && tempGrid[y][x] !== word[i]) {
            return false;
        }
    }
    return true;
}

//function that places word in given space and direction
function placeWord(word, tempGrid, directions, gridSize) {
    const positions = []; //array of possible positions, that word can be placed, needed to have 100% guarantee that the word to find will be in this grid

    //list of all possible positions
    directions.forEach(direction => {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                positions.push({ x, y, direction }); //push adds object to array
            }
        }
    });

    positions.sort(() => Math.random() - 0.5); //sorting array randomly

    for (const p of positions) { // "writing letter in positions (random ones, after sorting)"
    //checking if word fits with these parameters
        if (doesWordFits(word, p.x, p.y, p.direction, tempGrid, gridSize)) {
            for (let i = 0; i < word.length; i++) {
                const xx = p.x + (p.direction.x * i);
                const yy = p.y + (p.direction.y * i);
                //updating the grid from the passed argument
                tempGrid[yy][xx] = word[i];
            }
            return true;
        }
    }
    return false;
}

//random selection colors
function randomColor() {
    const r = Math.floor(Math.random() * 156 + 50);
    const g = Math.floor(Math.random() * 156 + 50);
    const b = Math.floor(Math.random() * 156 + 50);
    return `rgb(${r},${g},${b})`
}

function getCellStyle(row, col) {
  let style = {}; //variable that stores active style for cell

  //checking if the current cell is part of an active selection
  const isSelected = selection.value?.some(c => c.row === row && c.col === col); // ? ensures the code doesn't throw an error if the value is null or undefined
  if (isSelected) {
    style = { ...style, backgroundColor: selectionColor.value, color: 'white' }; //updating style, ...style copies all existing properties from the object
  }

  //checking if the cell is part of a found word
  for (const item of foundWordsData.value || []) {
    const isFound = item.coords?.some(c => c.row === row && c.col === col);
    if (isFound) {
      style = { ...style, backgroundColor: wordsColor.value[item.word], color: 'white' };
    }
  }

  //checking if the current cell is the hinted cell -  only applied if the cell is not part of a found word and is not being selected
  const isHinted = hintedCell.value && hintedCell.value.row === row && hintedCell.value.col === col;
  const isWordFound = foundWords.value.includes(wordsToFind.value.find(word => word.charAt(0) === grid.value[row][col]));
  if (isHinted && !isWordFound && !isSelected) {
    style = { ...style, border: '2px solid red' };
  }

  return style;
}

//functions related to word search - selecting letters
function startSelection(row, col) {
     if (!isValidCell(row, col)) return;
    isSelecting.value = true; //letter is being selected
    selection.value = [{ row, col }]; //coords of selected letters
    startCell.value = { row, col }; //the same as above (only first letter)
    selectionColor.value = randomColor(); //selecting random color for word
}

function extendSelection(row, col) { //after user drags mouse to select more letters
  if (!isSelecting.value || !startCell.value) return;  //if user already clicked mouse
  if (!isValidCell(row, col)) return;

  //calculating distance between letter
  const dx = col - startCell.value.col;
  const dy = row - startCell.value.row;

  const len = Math.max(Math.abs(dx), Math.abs(dy)) + 1; //how much letters should be selected from the start, +1 because if user is selecting letters from 
  // (2,2) to (2,5) then its 4 not 3

  let stepX; 
  if(dx === 0) { //we don't move horizontally
    stepX = 0 }
  else {
    stepX = dx / Math.abs(dx);} // we move in right if dx>0, in left if dx<0 

  let stepY; 
  if(dy === 0) { //we don't move vertically
    stepY = 0 }
  else {
    stepY = dy / Math.abs(dy);}

  const path = []; //list of selected letter
  for (let i = 0; i < len; i++) {
    path.push({ //pushing to list coords of every selected letter
      row: startCell.value.row + stepY * i,
      col: startCell.value.col + stepX * i,
    });
  }
  selection.value = path; //selected space
}

async function endSelection() { //if user stops clicking mouse
  if (!isSelecting.value) return; //if user is not selecting anything
  isSelecting.value = false; //stop selecting

const word = selection.value
  .map(({ row, col }) => {
    if (!grid.value[row] || grid.value[row][col] === undefined) { //checking if while selecting error will be displayed
      console.warn(`Invalid grid access at row ${row}, col ${col}`);
      return '';
    }
    return grid.value[row][col];
  }).join(''); //making whole word from selected letters, {row,col} is coords, 
  // .map - for every letter from grid with proper cords, .join - joining it in one word
  const match = wordsToFind.value.find(w => w === word); //checking if selected word is in searchWord list - words to find

  if (match && !foundWords.value.includes(word)) {
    if(!wordsColor.value[match]) {
        wordsColor.value[match] = selectionColor.value;
    }
    foundWordsData.value.push({ word: match, coords: [...selection.value] });
    foundWords.value.push(match); //pushing matching word to foundWords array so it can be crossed from words to found's list

    hintedCell.value = null;

    const isCompleted = foundWords.value.length === wordsToFind.value.length;
    await saveProgress(isCompleted); // <-- saving progress with correct state

    if (foundWords.value.length === wordsToFind.value.length) { //if all words was found
        await getUserStats(puzzleXp.value, puzzleCoins.value); //saving coins and xp from stage to user stats
        showPuzzleDone.value = true
    }
  }

  selection.value = []; //reseting selection
  startCell.value = null; //reseting first selected letter
  selectionColor.value = null //reseting selection color, so if user selectes another letters color will be different
}

//checking if selecting rows and cols fit in grid array
function isValidCell(row, col) {
  return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
}


//functions related to showing hints
// async function showHint() {
//     //checking if user has enough coins
//     const paymentSuccessful = await hintPayment(hintCost.value);
    
//     //if payment fails don't provide hint
//     if (!paymentSuccessful) {
//         console.log("Not enough coins to buy a hint!");
//         return;
//     }

//     // checking words that haven't been found yet
//     const unfoundWords = wordsToFind.value.filter(word => !foundWords.value.includes(word));

//     if (unfoundWords.length > 0) {
//         //selecting a random unfound word
//         const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];

//         //finding the coordinates of the first letter of that word
//         const foundWordData = foundWordsData.value.find(item => item.word === randomWord);
        
//         if (foundWordData) {
//             //using the first set of coordinates
//             hintedCell.value = foundWordData.coords[0];
//         } else {
//             //finding the coordinates if they aren't in foundWordsData.
//             for (let r = 0; r < gridSize; r++) {
//                 for (let c = 0; c < gridSize; c++) {
//                     //checking all directions from each cell to find the word
//                     if (grid.value[r][c].toUpperCase() === randomWord[0]) {
//                         //checking in every direction
//                         const directions = [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}, {x:1,y:1},{x:-1,y:-1},{x:-1,y:1},{x:1,y:-1}];
//                         for (const dir of directions) {
//                             let match = true;
//                             for (let i = 0; i < randomWord.length; i++) {
//                                 const newRow = r + dir.y * i;
//                                 const newCol = c + dir.x * i;
//                                 //checking negative values
//                                 if (newRow >= gridSize || newRow < 0 || newCol >= gridSize || newCol < 0 || grid.value[newRow][newCol].toUpperCase() !== randomWord[i].toUpperCase()) {
//                                     match = false;
//                                     break;
//                                 }
//                             }
//                             if (match) {
//                                 hintedCell.value = { row: r, col: c };
//                                 return;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

async function showHint() {
    const paymentSuccessful = await hintPayment(hintCost.value);
    
    // If payment is successful, show the animation and update coins
    if (paymentSuccessful) {
        // Update the user's coins variable immediately
        userCoins.value -= hintCost.value;

        // Show the animation and hide it after a delay
        showCoinsDeducted.value = true;
        setTimeout(() => {
            showCoinsDeducted.value = false;
        }, 1500); // Hide after 1.5 seconds

        // Check for unfound words and provide hint
        const unfoundWords = wordsToFind.value.filter(word => !foundWords.value.includes(word));

        if (unfoundWords.length > 0) {
            const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
            const foundWordData = foundWordsData.value.find(item => item.word === randomWord);
            
            if (foundWordData) {
                hintedCell.value = foundWordData.coords[0];
            } else {
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        if (grid.value[r][c].toUpperCase() === randomWord[0]) {
                            const directions = [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}, {x:1,y:1},{x:-1,y:-1},{x:-1,y:1},{x:1,y:-1}];
                            for (const dir of directions) {
                                let match = true;
                                for (let i = 0; i < randomWord.length; i++) {
                                    const newRow = r + dir.y * i;
                                    const newCol = c + dir.x * i;
                                    if (newRow >= gridSize || newRow < 0 || newCol >= gridSize || newCol < 0 || grid.value[newRow][newCol].toUpperCase() !== randomWord[i].toUpperCase()) {
                                        match = false;
                                        break;
                                    }
                                }
                                if (match) {
                                    hintedCell.value = { row: r, col: c };
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

//functions for icons on bottom
async function nextStage() {
    if (currentStage.value < maxStage.value) {
        currentStage.value++;
        await loadStage(currentStage.value);
        //completed status is false by default for a new stage
        await saveProgress(false); 
    } else {
        //checking if the final stage is completed
        if (progressData[maxStage.value]?.completed) {
            showCategoryDone.value = true;
        } else {
            console.log("No more stages available or the final stage is not yet completed.");
        }
    }
}

function goBack() {
    router.back();
}


// loading before mounting component
onMounted(async () => {
   await getUser();
   await loadData();
   await getUserAvatar();
   await getUserCoins();
});

</script>

<style lang="scss" scoped>
.background-container {
    width: 100vw;
    height: 100vh;
}

.container {
    background-color: rgb(174, 210, 229);
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;

    .right-up-wrapper {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px; 

        .coins-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

            p {
                font-size: 24px;
                text-align: center;
                margin: 0;
            }

            img {
                width: 42px;
                height: 42px;
            }
        }

        .coins-deducted {

            p{
                font-size: 18px;
            }

            img{
                width: 36px;
                height: 36px;
            }
        }

        .avatar-wrapper {
            cursor: pointer;
        }
        
        .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }

    }


    .text-container {
        text-align: center;
        margin-top: 12px;

        h2{
            font-size: 56px;
            margin-bottom: 4px;
        }

        .bigger{
            font-size: 32px;
            margin-bottom: 4px;
        }

        .smaller {
            font-size: 28px;
            margin-bottom: 64px;
        }
    }

    .wrapper-search {
        display: flex;
        justify-content: center;
        //align-items: center;
        gap: 96px;

        .words-list {
            text-align: center;

            h4{
                font-size: 36px;
                font-weight: 500;
                margin-bottom: 4px;
            }

            ul {
                list-style: none;

                li {
                    font-size: 24px;
                    line-height: 1.8;
                }
            }

            .foundWord {
                color: rgba(0, 0, 0, 0.5);
                text-decoration: line-through;
                text-decoration-color: black;
                text-decoration-thickness: 3px;
            }
        }

        .grid{
            display: flex;
            flex-direction: column;
            border: 4px solid #57A4CD;
            // gap: 2px;
    
            .row {
                display: flex;
                // gap: 2px;
    
                .cell {
                    background: #f9f9f9;
                    width: 44px;
                    height: 44px;
                    text-align: center;
                    line-height: 44px;
                    font-weight: 400;
                    //border: 2px solid #ccc;
                    font-size: 28px;
                    cursor: pointer;
                }

                .cell:hover:not(.cell.selected):not(.cell.found) {
                    outline: 2px solid #ccc; //unlike border, this doesn't affect size of a cell 
                    outline-offset: -2px; //so this border won't be outside the cell
                    
                }

            }
    
        }
    }

    .bottom{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 64px;
        background-color: #57A4CD;
        width: 280px;
        height: auto;
        border: 4px solid black;
        border-radius: 24px;
        gap: 24px;

        img{
            width: 44px;
            cursor: pointer;
            margin-top: 0;
        }
    }

    .puzzle-done{
        //display: none;
        background-color: pink;
        border-radius: 6px;
        width: 540px;
        height: 420px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: rgba(113, 172, 204,0.6);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);

        h2{
            font-size: 54px;
            font-weight: 500;
            text-align: center;
            width: 300px;
            margin-bottom: 24px;
        }

        .rewards-txt {
            display: flex;
            gap: 64px;
            font-size: 24px;
            margin-bottom: 24px;

            .txt-icon {
                display: flex;
                align-items: center;
                gap: 8px;
                
                img {
                    width: 48px;
                    position: relative;
                    bottom: 8px;
                }
            }

        }

        .btns {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 64px;

            button {
            font-size: 24px;
            padding: 1% 12%;
            font-weight: 500;
            background-color: #f9f9f9;
            border: 2px solid black;
            border-radius: 6px;
            cursor: pointer;
            transform: perspective(1px) translateZ(0);
            box-shadow: 0 0 1px transparent;
            transition-duration: 0.3s;
            transition-property: box-shadow, transform;
            }

            button:hover {
                box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86);
                transform: scale(1.1);
            }

            .next-btn {
                background-color: #71ACCC;
            }
        }

    }

    .category-done {
        //display: none;
        background-color: pink;
        border-radius: 6px;
        width: 696px;
        height: 496px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: rgba(113, 172, 204,0.6);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    h2 {
        font-size: 54px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 24px;
    }

    p{
        font-size: 28px;
        text-align: center;
    }

    img {
        margin-top: 24px;
        width: 200px;
    }

    .btns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 64px;

        button {
            font-size: 24px;
            padding: 1% 12%;
            font-weight: 500;
            background-color: #f9f9f9;
            border: 2px solid black;
            border-radius: 6px;
            cursor: pointer;
            transform: perspective(1px) translateZ(0);
            box-shadow: 0 0 1px transparent;
            transition-duration: 0.3s;
            transition-property: box-shadow, transform;
        }

        button:hover {
                box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86);
                transform: scale(1.1);
        }

        .next-btn {
                background-color: #71ACCC;
        }
        }
}
</style>