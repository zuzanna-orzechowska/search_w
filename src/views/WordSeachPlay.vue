<template>
    <div class="background-container">
        <div class="container">
            <div class="text-container">
                <h2>{{ categoryName }}</h2>
                <p class="bigger">Stage {{ currentStage }} / {{ maxStage }}</p>
                <p class="smaller">Words appear horizontally, vertically and diagonally.</p>
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
                <img src="../assets/hint-icon.svg" alt="hint icon">
            </div>

            <div class="puzzle-done" v-if="showPuzzleDone">
                <h2>Puzzle completed!</h2>
                <div class="rewards-txt">
                    <div class="txt-icon">
                        <p>+ 10 coins</p>
                        <img src="../assets/coin-icon.svg" alt="coin icon">
                    </div>
                    <div class="txt-icon">
                        <p>+ 25 exp</p>
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

const wordsToFind = ref([]);
const route = useRoute();
const router = useRouter();
const grid = ref([]); //blank array
const gridSize = 12;

const category = route.query.category; //query parameters in URL adress -< /ws?category=fruit
const categoryName = ref('');
categoryName.value = category.charAt(0).toUpperCase()+category.slice(1);

const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_PLAY_ID;

const foundWords = ref([]);
const selection = ref([]); //letters that are selected - its' coordinates x,y
const isSelecting = ref(false); //does user is selecting letter with clicked mouse
const startCell = ref(null); //first letter from selected word
const selectionColor = ref(null) // current color of selecting letter
const wordsColor = ref({}); //which word has which color
const foundWordsData = ref([]) //info of found - value of word and it's cords

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

function endSelection() { //if user stops clicking mouse
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

    const progressKey = `puzzleProgress_${category}_stage_${currentStage.value}`;
    localStorage.setItem(progressKey, JSON.stringify({
        foundWords: foundWords.value,
        foundWordsData: foundWordsData.value,
        grid: grid.value,
        currentStage: currentStage.value,
        wordsColor: wordsColor.value 
    }));

    if (foundWords.value.length === wordsToFind.value.length) { //if all words was found
        showPuzzleDone.value = true

        for (let key in localStorage) { //removing all variables from local storage and marking it as completed
            if (key.startsWith(`puzzleProgress_${category}_stage_`) || 
                key.startsWith(`puzzleGrid_${category}_stage_`) ||
                key === `currentStage_${category}`) {
                localStorage.removeItem(key);
            }
        }
        localStorage.setItem(`categoryCompleted_${category}`, "true");
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

function generateGrid() {
    const gridKey = `puzzleGrid_${category}_stage_${currentStage.value}`; //used with local storage to store progress to proper word search puzzle
    const savedGrid = localStorage.getItem(gridKey); //checking if user has already played the game
    if (savedGrid) { //if yes, then this grid is parsed into actual array
        grid.value = JSON.parse(savedGrid);
        return;
    }

    const temp = Array.from({length: gridSize}, () => Array(gridSize).fill("")); //creating copy of grid array - size of 12, and filling it with blank strings, 
    //Array.from creates new copied Array from array-like object, namely grid
    const directions = [{x:1,y:0},{x:0,y:1},{x:1,y:1}] //three directions of words placement - x=1,y=0 is horizontally, x=0,y=0 is vertically, x=1,y=1 is diagonally

    //function that checks if given words will fit into the grid in given place (starting from given x and y and direction)
    function doesWordFits(word,startX,startY,direction) {
        //firstly we need to calculate end of the word, using it's length
        const endX = startX + direction.x * (word.length - 1); //first letter is in starting position that's why word.length-1
        const endY = startY + direction.y * (word.length - 1);

        if(endX >= gridSize || endY >=gridSize) return false;

        //checking if it's a letter coliision - if yes then given letter is shared
        for (let i = 0; i < word.length; i++) {
            const x = startX + direction.x * i;
            const y = startY + direction.y * i;
            if (temp[y][x] !== '' && temp[y][x] !== word[i]) {
                return false; 
            }
        }

        return true;
    }

    //function that places word in given space and direction
    function placeWord(word) {
        const positions = [] //array of possible positions, that word can be placed, needed to have 100% guarantee that the word to find will be in this grid

        //list of all possibles
        directions.forEach(direction => {
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    positions.push({ x, y, direction }); //push adds object to array
                }
            }
        });

        //sorting array randomly
        positions.sort(() => Math.random() - 0.5)

        for (const p of positions) { // "writing letter in positions (random ones, after sorting)"
         //checking if word fits with these parameters
            if (doesWordFits(word, p.x, p.y, p.direction)) {
                //placing letter on grid
                for (let i = 0; i < word.length; i++) {
                    const xx = p.x + (p.direction.x * i);
                    const yy = p.y + (p.direction.y * i);
                    temp[yy][xx] = word[i];
                }
                return;
            }
        }
    }

    //placing random letter in blank spaces in grid, but fisrtly placing all words to find in grid
    wordsToFind.value.forEach(word => placeWord(word.toUpperCase()));

    const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(let i = 0; i<gridSize; i++){
        for(let j = 0; j<gridSize; j++){
            if(temp[j][i] === '') {
                temp[j][i] = letter[Math.floor(Math.random()*letter.length)];
            }
        }
    }
    grid.value = temp;
    localStorage.setItem(gridKey, JSON.stringify(temp)); //placing created grid to local storage, so user can go back to puzzle later without losing progress
}
//random selection colors
function randomColor() {
    const r = Math.floor(Math.random() * 156 + 50);
    const g = Math.floor(Math.random() * 156 + 50);
    const b = Math.floor(Math.random() * 156 + 50);
    return `rgb(${r},${g},${b})`
}

function getCellStyle(row, col) {
  //if letter is being selected
  if (selection.value.some(c => c.row === row && c.col === col)) {
    return { backgroundColor: selectionColor.value, color: 'white' };
  }

  for (const item of foundWordsData.value) {
    if (item.coords.some(c => c.row === row && c.col === col)) {
      return { backgroundColor: wordsColor.value[item.word], color: 'white' };
    }
  }

  return {};
}

//database and words
let title = ref('');
let currentStage = ref(1);
let maxStage = ref();
const showPuzzleDone = ref(false);
const showCategoryDone = ref(false);

async function loadData() {
    try {
        const data = await databases.listDocuments(database_id,collection_id); //finding proper collection
        const puzzlesData = data.documents.filter(doc => doc.title === category);
        const words = data.documents.find(doc => doc.title === category); //finding proper document with given category name as title value
        
        if (puzzlesData.length > 0) {
            title.value = puzzlesData[0].title

            //finding max puzzleId - to know how many of stages there are
            const stages = puzzlesData.map(doc => {
                const num = parseInt(doc.puzzleId.split('-')[1]) //spliting name for example fruit-2 to array - "fruit","2", taking second element and parsing it to int
                return isNaN(num) ? 0 : num //if there is no number then 0
            })
            maxStage.value = Math.max(...stages) //taking max number from given array

            loadStage(currentStage.value); //loading numer of current stage
        }

        if (words) { //if array of words was found
            wordsToFind.value = words.searchWord;
            generateGrid();
        } else {
            console.log("Error, couldn't find category", category);
        }

        // console.log('Title:', title.value)
        // console.log('Max stage:', maxStage.value)
        // console.log('Current puzzleId:', puzzlesData[0]?.puzzleId)

    } catch (err) {
        console.log("Error: ",err);
    }
}

async function loadStage(stage) {
    try {
        const data = await databases.listDocuments(database_id,collection_id); //finding proper collection
        const puzzlesData = data.documents.filter(doc => doc.title === category);

        const stageDoc = puzzlesData.find(doc => { //finding last stage of puzzle that user used
            const num = parseInt(doc.puzzleId.split('-')[1]); //puzzleId is for example fruit-1, we only need a number
            return num === stage;
        });

        if (stageDoc) {
            wordsToFind.value = stageDoc.searchWord;

            // checking if user has saved progress to proper stage
            const progressKey = `puzzleProgress_${category}_stage_${stage}`;
            const savedProgress = localStorage.getItem(progressKey);

            if (savedProgress) {
                const parsed = JSON.parse(savedProgress); //parsed is an array with saved informations about puzzle and user's progress like found words
                foundWords.value = parsed.foundWords || [];
                foundWordsData.value = parsed.foundWordsData || [];
                wordsColor.value = parsed.wordsColor || {};
                // showPuzzleDone is visible when all of the words was found
                showPuzzleDone.value = (foundWords.value.length === wordsToFind.value.length);
            } else {
                foundWords.value = [];
                foundWordsData.value = [];
                wordsColor.value = {};
                showPuzzleDone.value = false; //reseting for new stage
            }

            generateGrid();
            //console.log("Loaded stage:", stage, "PuzzleId:", stageDoc.puzzleId);
        } else {
            console.log("Stage not found:", stage);
        }
    } catch (err) {
        console.log("Error: ",err);
    }
}

function nextStage() {
    if (currentStage.value < maxStage.value) {
        currentStage.value++;
        localStorage.setItem(`currentStage_${category}`, currentStage.value); //saving curent stage to local storage
        showPuzzleDone.value = false;
        loadStage(currentStage.value);
    } else {
        if(currentStage.value === maxStage.value) {
            showCategoryDone.value = true;
        }
        console.log("No more stages");
    }
}


//functions for icons on bottom
function goBack() {
    router.back();
}

onMounted(() => {
    //checking what was the last stage to certain category
    const savedStage = localStorage.getItem(`currentStage_${category}`);
    if (savedStage) {
        currentStage.value = parseInt(savedStage, 10); //converting string to Int, 10 is for decimal system
    } else {
        currentStage.value = 1; //starting from 1
    }

    //loading progress to current stage and category
    const progressKey = `puzzleProgress_${category}_stage_${currentStage.value}`;
    const saved = localStorage.getItem(progressKey);
    if (saved) { //loading proper data form saved progress
        const parsed = JSON.parse(saved);
        foundWords.value = parsed.foundWords || [];
        foundWordsData.value = parsed.foundWordsData || [];
        grid.value = parsed.grid || [];
        wordsColor.value = parsed.wordsColor || {};
    }

    loadData();
});

</script>

<style lang="scss" scoped>
.background-container {
    background-color: rgb(174, 210, 229);
    width: 100vw;
    height: 100vh;
}

.container {
    display: flex;
    align-items: center;
    flex-direction: column;

    .text-container {
        text-align: center;
        margin-top: 12px;

        h2{
            font-size: 56px;
            margin-bottom: 4px;
        }

        .bigger{
            font-size: 28px;
            margin-bottom: 4px;
        }

        .smaller {
            font-size: 24px;
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
        text-align: center !important;
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