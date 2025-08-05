<template>
    <div class="background-container">
        <div class="container">
            <div class="words-list">
                <ul>
                    <li v-for="(word,ind) in wordsToFind" :key="ind">{{ word }}</li>
                </ul>
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

const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_PLAY_ID;

async function loadSearchWord() {
    try{
        const category = route.query.category; //query parameters in URL adress -< /ws?category=fruit
        const data = await databases.listDocuments(database_id,collection_id); //finding proper collection
        const words = data.documents.find(doc => doc.title === category); //finding proper document with given category name as title value

        if (words) { //if array of words was found
            wordsToFind.value = words.searchWord;
        } else {
            console.log("Error, couldn't find category", category);
        }
    }catch (err) {
        console.log("Error: ",err);
    }
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
</style>