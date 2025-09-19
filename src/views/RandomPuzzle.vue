<template>
    <div class="background-container">
        <div class="container">
            
            <div class="text-container">
                <h2>{{ categoryName }}</h2>
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
//imports
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

//all variables
//global variables
const route = useRoute();
const router = useRouter();

//variables related to word search 
const allWordsData = ref([]);
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
const completedCategories = ref(0);
let showCreateAccount = ref(false);   

//variables related to database
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_PLAY_ID;


//functions related to database
async function loadData() {
    try {
        //finding max stage from original puzzle collection
        const puzzlesData = await databases.listDocuments(database_id, collection_id, [Query.equal("title", category)]);
        if (puzzlesData.total === 0) {
            console.log("Error, couldn't find category", category);
            return;
        } else {
            const puzzlesDocs = puzzlesData.documents[0];
            wordsToFind.value = puzzlesDocs.searchWord;
        }
        
    } catch (err) {
        console.log("Error:", err);
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
            const coords = [];
            for (let i = 0; i < word.length; i++) {
                const xx = p.x + (p.direction.x * i);
                const yy = p.y + (p.direction.y * i);
                //updating the grid from the passed argument
                tempGrid[yy][xx] = word[i];
                coords.push({ row: yy, col: xx });
            }
            allWordsData.value.push({ word: word, coords: coords });
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
  let style = {};

  // Check if the current cell is part of an active selection
  const isSelected = selection.value?.some(c => c.row === row && c.col === col);
  if (isSelected) {
    style = { ...style, backgroundColor: selectionColor.value, color: 'white' };
  }

  // Check if the cell is part of a found word
  const isFound = foundWordsData.value?.some(item => item.coords?.some(c => c.row === row && c.col === col));
  if (isFound) {
    // If the cell is found, apply its specific color
    const foundItem = foundWordsData.value.find(item => item.coords?.some(c => c.row === row && c.col === col));
    if (foundItem) {
      style = { ...style, backgroundColor: wordsColor.value[foundItem.word], color: 'white' };
    }
  }

  // Check if the current cell is the hinted cell
  // This is the correct way to apply the hint without interfering with found words
  const isHinted = hintedCell.value && hintedCell.value.row === row && hintedCell.value.col === col;
  if (isHinted && !isFound && !isSelected) {
    style = { ...style, border: '2px solid red' };
  }

  return style;
}

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

    hintedCell.value = null;

    //const isCompleted = foundWords.value.length === wordsToFind.value.length;

    if (foundWords.value.length === wordsToFind.value.length) { //if all words was found
        showCreateAccount = true;
        onComplete();
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


//other functions
async function showHint() {
    const unfoundWords = allWordsData.value.filter(wordData => !foundWords.value.includes(wordData.word));

    if (unfoundWords.length > 0) {
        const randomWordData = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
        const firstLetterCoords = randomWordData.coords[0];
        hintedCell.value = firstLetterCoords;

        // console.log(`Hinting for word: ${randomWordData.word}`);
    } else {
        console.log('No words left to show a hint for.');
    }
}

function onComplete() {
    completedCategories.value = 1;
    localStorage.setItem('guestProgress', completedCategories.value);
}

function goBack() {
    router.back();
}


// loading before mounting component
onMounted(async () => {
   await loadData();
   generateGrid();
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

    .category-done {
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