<template>
    <div class="container">
        <div class="wrapper">
            <div class="text-container">
                <h2>Play</h2>
                <p class="bigger">Choose a category</p>
                <p class="smaller">0/{{categoryLen}} completed</p>
            </div>
            <div class="scroll">
                <div class="categories-container">
                    <div class="category" v-for="category in categories" :key="category.name">
                        <img :src="category.image" :alt="category.name">
                        <button>Play</button>
                    </div>
            </div>
            </div>

            <div class="footer">
                <button @click="goBack">Back</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
// MAYBE CHANGE THIS TO UTILS? will be used later in other files
const categories = [{ name: "fruit", image: require("@/assets/categories/fruit.png") },
        { name: "vegetables", image: require("@/assets/categories/vegetables.png") },
        { name: "animals", image: require("@/assets/categories/animals.png") },
        { name: "body", image: require("@/assets/categories/body.png") },
        { name: "emotions", image: require("@/assets/categories/emotions.png") },
        { name: "cities", image: require("@/assets/categories/cities.png") },
        { name: "countries", image: require("@/assets/categories/countries.png") },
        { name: "school", image: require("@/assets/categories/school.png") },
        { name: "movies", image: require("@/assets/categories/movies.png") },
        { name: "actors", image: require("@/assets/categories/actors.png") },
        { name: "fairytales", image: require("@/assets/categories/fairytales.png") },
        { name: "disney", image: require("@/assets/categories/disney.png") },
        { name: "games", image: require("@/assets/categories/games.png") },
        { name: "music", image: require("@/assets/categories/music.png") },
        { name: "electronics", image: require("@/assets/categories/electronics.png") },
        { name: "food", image: require("@/assets/categories/food.png") },
        { name: "drinks", image: require("@/assets/categories/drinks.png") },
        { name: "plants", image: require("@/assets/categories/plants.png") },
        { name: "space", image: require("@/assets/categories/space.png") },
        { name: "summer", image: require("@/assets/categories/summer.png") },
        { name: "halloween", image: require("@/assets/categories/halloween.png") },
        { name: "christmas", image: require("@/assets/categories/christmas.png") },
        { name: "easter", image: require("@/assets/categories/easter.png") }
    ]

const categoryLen = categories.length;

function goBack() {
    router.back();
}
</script>

<style lang="scss">
body {
    background-image: url("../assets/background-play.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    
    .wrapper {
        background-color: rgba(174, 210, 229,0.5);
        backdrop-filter: blur(20px);
        width: 60vw;
        height: 90vh;
        border-radius: 6px;
        box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        //justify-content: center;
        flex-direction: column;
        position: relative;
    }

    .text-container {
        text-align: center;

        h2 {
            font-size: 64px;
            font-weight: 500;
            margin-bottom: 4px;
        }

        .bigger{
            font-size: 32px;
            margin-bottom: 4px;
        }

        .smaller {
            font-size: 24px;
        }
    }

    .scroll {
        flex: 1; //take up whole space of container wrapper
        overflow-y: auto; //enable vertical scroll
        padding-bottom: 100px;

        .categories-container {
            display: grid;
            grid-template-columns: repeat(5,1fr);
            gap: 2vw;
            margin-top: 42px;
    
            .category {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1vw;
    
                img {
                    width: 136px;
                    border: 2px solid black;
                    border-radius: 6px;
                }
    
                button {
                    font-size: 20px;
                    padding: 1% 6%;
                    font-weight: 500;
                    background-color: #2A8DC1;
                    border: 2px solid black;
                    border-radius: 12px;
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
            }
        }
    }


    .footer {
        background-color: rgb(174, 210, 229);
        width: 100%;
        height: 80px;
        position: fixed;
        bottom: 0px;
        left: 0px;
        button {
            font-size: 24px;
            padding: 1% 2%;
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
    }
}

</style>

<!--
<div class="category">
                    <img src="../assets/categories/fruit.png" alt="Fruit category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/animals.png" alt="Animals category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/body.png" alt="Body category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/emotions.png" alt="Emotions category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/cities.png" alt="Cities category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/countries.png" alt="Countries category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/movies.png" alt="Movie category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/actors.png" alt="Actors category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/fairytales.png" alt="Fairytales category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/games.png" alt="Games category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/electronics.png" alt="Electronics category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/food.png" alt="Food category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/plants.png" alt="Plants category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/space.png" alt="Space category">
                    <button>Play</button>
                </div>
                <div class="category">
                    <img src="../assets/categories/summer.png" alt="Summer category">
                    <button>Play</button>
                </div>
-->