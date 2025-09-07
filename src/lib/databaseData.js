import {databases } from './appwrite.js';
// import { puzzles } from './puzzles.js';
import { puzzlesChallenge } from './puzzlesChallenge.js';
import 'dotenv/config';

const database_id = process.env.VUE_APP_DATABASE_ID;
//const collection_id = process.env.VUE_APP_COLLECTION_PLAY_ID;
const collection_challenge_id = process.env.VUE_APP_COLLECTION_CHALLENGE_ID;

async function addData() {
    try {
        for (let puzzle of puzzlesChallenge) {
            await databases.createDocument(database_id,collection_challenge_id,'unique()',puzzle);
            console.log(`Added puzzle", ${puzzle.title}`)
        }
    }catch (err) {
        console.log("Error: ",err);
    }
}

addData();