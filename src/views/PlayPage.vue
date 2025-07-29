<template>
    <div class="container">
        <div class="wrapper">
            <div class="text-container">
                <h2>Play</h2>
                <p class="bigger">Choose a category</p>
                <p class="smaller">0/16 completed</p>
            </div>
            <div class="categories-container">
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
            </div>
        </div>
    </div>
</template>

<script setup>
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

</style>