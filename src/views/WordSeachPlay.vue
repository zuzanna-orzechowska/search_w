<template>
    <div class="background-container">
        <div class="container">
            <div class="words-list">
                <ul>
                    <li v-for="(word,ind) in wordsToFind" :key="ind">{{ word }}</li>
                </ul>
            </div>

            <div class="grid">
                <!--2D array-->
                <div class="row" v-for="(row,indRow) in grid" :key="indRow">
                    <span class="cell" v-for="(cell,indCell) in row" :key="indCell"> {{ cell }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { databases } from '@/lib/appwrite';

const wordsToFind = ref([]);
const route = useRoute();
const grid = ref([]); //blank array
const gridSize = 12;

const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_PLAY_ID;

async function loadSearchWord() {
    try{
        const category = route.query.category; //query parameters in URL adress -< /ws?category=fruit
        const data = await databases.listDocuments(database_id,collection_id); //finding proper collection
        const words = data.documents.find(doc => doc.title === category); //finding proper document with given category name as title value

        if (words) { //if array of words was found
            wordsToFind.value = words.searchWord;
            generateGrid();
        } else {
            console.log("Error, couldn't find category", category);
        }
    }catch (err) {
        console.log("Error: ",err);
    }
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

onMounted(() => {
    loadSearchWord();
})
</script>

<style lang="scss" scoped>
.background-container {
    background-color: rgb(174, 210, 229);
    width: 100vw;
    height: 100vh;
}

.container {


    .grid{
        display: flex;
        flex-direction: column;
        gap: 8px;

        .row {
            display: flex;
            gap: 4px;

            .cell {
                background: white;
                width: 32px;
                height: 32px;
                text-align: center;
                line-height: 32px;
                font-weight: bold;
                border: 1px solid #ccc;
            }
        }

    }
}
</style>