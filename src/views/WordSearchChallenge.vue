<template>
    <div class="background-container">
        <div class="container">
            <div class="text-container">
                <h2>{{ categoryName }}</h2>
                <!-- <p class="bigger">Find all given words within time limit to win!</p>
                <p class="smaller">Words may appear horizontally, vertically and diagonally, forwards and backwards.</p> -->
                <p class="bigger">{{ timeString }}</p>
                <p class="smaller">Found {{ foundWords.length }} / {{ wordsToFind.length }}</p>
            </div>
            <div class="wrapper-search">
                <div class="wrapper-words-text">
                    <h4>Words to find:</h4>
                    <div class="wrapper-words-list">
                        <div class="words-list">
                            <ul>
                                <li :class="{foundWord : foundWords.includes(word)}" v-for="(word,ind) in wordsToFindFirst" :key="ind">{{ word }}</li>
                            </ul>
                        </div>
                        <div class="words-list">
                            <ul>
                                <li :class="{foundWord : foundWords.includes(word)}" v-for="(word,ind) in wordsToFindSecond" :key="ind">{{ word }}</li>
                            </ul>
                        </div>
                    </div>
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
                <img @click="isChallengePaused = true; stopTimer()" src="../assets/pause-icon.svg" alt="pause icon">
            </div>

           <div class="challenge-paused" v-if="isChallengePaused">
                <h2>Game paused</h2>
                <div class="paused-txt">
                    <p>Want to continue?</p>
                    <div class="btns">
                        <button @click="isChallengePaused = false; startTimer()" class="continue-btn">Continue</button>
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
                <h2>Good job!</h2>
                <div class="results">
                    <div class="stars">
                        <img src="../assets/full-star.svg" alt="full star">
                        <img src="../assets/full-star.svg" alt="full star">
                        <img src="../assets/blank-star.svg" alt="full star">
                    </div>
                    <p>Record: <span>{{ timeString }}</span></p>
                </div>
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
                    <button class="again-btn">Play again</button>
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
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

//global variables
const route = useRoute();
const router = useRouter();
const isChallengePaused = ref(false);
const isChallengeCompleted = ref(false);
const isGameStarted = ref(false); //! CHANGE TO FALSE
const time = ref(0);
const timeString = ref('00:00');
const timer = ref(null);
const canInteract = computed(() => isGameStarted.value && !isChallengePaused.value && !isChallengeCompleted.value);

//variables related to word search 
const wordsToFind = ref([]);
const wordsToFindFirst = ref([]);
const wordsToFindSecond = ref([]);
const grid = ref([]); //blank array
const gridSize = 14;
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

//variables related to database
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_CHALLENGE_ID;

async function loadData () {
    //optimized query to only fetch documents for the specific category
    const data = await databases.listDocuments(database_id, collection_id, [Query.equal("title", category)]);

    wordsToFind.value = data.documents[0].searchWord;
    const half = Math.ceil(wordsToFind.value.length/2);
    wordsToFindFirst.value = wordsToFind.value.slice(0,half);
    wordsToFindSecond.value = wordsToFind.value.slice(half);

    if (grid.value.length === 0) generateGrid();
}

function generateGrid() {
    const temp = Array.from({length: gridSize}, () => Array(gridSize).fill("")); //creating copy of grid array - size of 12, and filling it with blank strings, 
    //Array.from creates new copied Array from array-like object, namely grid
    //8 directions of words placement - horizontally: x=1,y=0 / x=-1,0 (backwards), 
    //vertically: x=0,y=1 / x=0,y=-1 (backwards), 
    //diagonally: x=1,y=1 (down-rigth) / x=-1,y=-1 (up-left) /  x=-1,y=1 (down-left) / x=1,y=-1 (down-right)
    const directions = [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1},
    {x:1,y:1},{x:-1,y:-1},{x:-1,y:1},{x:1,y:-1}]

    //function that checks if given words will fit into the grid in given place (starting from given x and y and direction)
    function doesWordFits(word,startX,startY,direction) {
        //firstly we need to calculate end of the word, using it's length
        const endX = startX + direction.x * (word.length - 1); //first letter is in starting position that's why word.length-1
        const endY = startY + direction.y * (word.length - 1);

        if(endX >= gridSize || endY >=gridSize || endX < 0 || endY < 0) return false;

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

  return style;
}

//functions related to word search - selecting letters
function startSelection(row, col) {
    if (!canInteract.value) return; //if user didn't start a game, can select words
    if (!isValidCell(row, col)) return;
    isSelecting.value = true; //letter is being selected
    selection.value = [{ row, col }]; //coords of selected letters
    startCell.value = { row, col }; //the same as above (only first letter)
    selectionColor.value = randomColor(); //selecting random color for word
}

function extendSelection(row, col) { //after user drags mouse to select more letters
    if (!canInteract.value) return;
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
    if (!canInteract.value) return;
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

    // const isCompleted = foundWords.value.length === wordsToFind.value.length;

    if (foundWords.value.length === wordsToFind.value.length) { //if all words was found
        stopTimer(); //stopping the timer after all of words was found
        isChallengeCompleted.value = true;
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


//functions for handeling time
function startTimer() {
    timer.value = setInterval(() => {
        time.value++;
        const minutes = Math.floor(time.value / 60);
        const seconds = time.value % 60;
        //padStart is a function that adds to given value (here minutes or seconds) string '0' so it's always two digits
        timeString.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer.value);
    timer.value = null;
}

function startGame() {
    isGameStarted.value = true;
    startTimer();
}

//function for icon on bottom
function goBack() {
    router.back();
}

onMounted( async () => {
    await loadData();
})
</script>

<style lang="scss" scoped>
.background-container {
    background-color: rgb(174, 210, 229);
    width: 100vw;
    height: 100vh;
}

.container {
    background-color: rgb(174, 210, 229);
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
            font-size: 32px;
            margin-bottom: 4px;
            font-weight: 500;
        }

        .smaller {
            font-size: 28px;
            margin-bottom: 32px;
        }
    }

    .wrapper-search {
        display: flex;
        justify-content: center;
        gap: 48px;

        .wrapper-words-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            h4{
                font-size: 36px;
                font-weight: 500;
                margin-bottom: 4px;
                text-align: center;
            }

            .wrapper-words-list {
                display: flex;
                gap: 24px;
    
                .words-list {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
        
                    ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        text-align: center;
        
                        li {
                            font-size: 24px;
                            line-height: 2.4;
                        }
                    }
        
                    .foundWord {
                        color: rgba(0, 0, 0, 0.5);
                        text-decoration: line-through;
                        text-decoration-color: black;
                        text-decoration-thickness: 3px;
                    }
                }
            }
        }



        .grid{
            display: flex;
            flex-direction: column;
            border: 4px solid #FFBA08;
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
        margin-top: 32px;
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

    
    .challenge-paused, .before-game {
        //display: none;
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
        gap: 8px;
    }
    
    h2 {
        font-size: 54px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 24px;
    }
    
    .paused-txt, .before-txt {
        display: flex;
        flex-direction: column;
        gap: 16px;

        p{
            font-size: 28px;
            text-align: center;
        }

        .warning {
            font-size: 18px;
            color: rgb(216, 5, 5);
        }
        
        .btns {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 64px;

            .continue-btn {
                background-color: #71ACCC;
            }
            
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
            
            .next-btn, .play-btn {
                background-color: #71ACCC;
            }
        }
    }

    .before-txt {
        p{
            font-size: 20px;
        }

        .btns {
            margin-top: 24px;
        }
    }

    .paused-txt.second {
        margin-top: 32px;
        margin-bottom: 8px;
    }

}

.challenge-completed{
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
        //width: 300px;
        margin-bottom: 12px;
    }

    .results {
        margin-bottom: 24px;
        text-align: center;

        .stars {
            img {
                width: 80px;
            }
        }

        p {
            font-size: 24px;

            span {
                font-weight: 500;
            }
        }
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

        .again-btn {
            background-color: #71ACCC;
            padding: 1% 14%;
        }
    }

}
</style>