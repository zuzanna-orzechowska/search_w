import {databases } from './appwrite.js';
import 'dotenv/config';

const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_PLAY_ID;

const puzzles = [
    {
        title: "fruit",
        puzzleId: "fruit-1",
        searchWord: ["apple", "banana", "pear", "kiwi", "plum", "orange", "mango", "grape", "melon", "cherry"],
        coin: 10,
        xp: 25
    },
];

async function addData() {
    try {
        for (let puzzle of puzzles) {
            await databases.createDocument(database_id,collection_id,'unique()',puzzle);
            console.log(`Added puzzle", ${puzzle.title}`)
        }
    }catch (err) {
        console.log("Error: ",err);
    }
}

addData();