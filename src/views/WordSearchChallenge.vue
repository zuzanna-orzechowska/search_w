<template>
    <div class="background-container">
        <div class="container">
            <div class="text-container">
                <h2>{{ categoryName }}</h2>
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
                        <span class="cell" v-for="(cell, indCell) in row" :key="indCell">
                        {{ cell }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="bottom">
                <img @click="goBack" src="../assets/home-icon.svg" alt="home icon">
            </div>

            <!-- <div class="puzzle-done" v-if="showPuzzleDone">
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
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

//global variables
const route = useRoute();
const router = useRouter();

//variables related to word search 
const wordsToFind = ref([]);
const grid = ref([]); //blank array
const gridSize = 16;
const category = route.query.category; //query parameters in URL adress -< /ws?category=fruit
const categoryName = ref('');
categoryName.value = category.charAt(0).toUpperCase()+category.slice(1);
const foundWords = ref([]);

//variables related to database
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_CHALLENGE_ID;

async function loadData () {
    //optimized query to only fetch documents for the specific category
    const data = await databases.listDocuments(database_id, collection_id, [Query.equal("title", category)]);

    wordsToFind.value = data.documents[0].searchWord;

    if (grid.value.length === 0) generateGrid();
}

function generateGrid() {
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