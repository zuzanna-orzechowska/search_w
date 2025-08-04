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
import { ref } from 'vue';

const wordsToFind = ref(["elo","melo","320"]);
</script>

<style lang="scss" scoped>
.background-container {
    background-color: rgb(174, 210, 229);
    width: 100vw;
    height: 100vh;
}
</style>