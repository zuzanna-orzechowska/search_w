<template>
    <div class="background-lines">
        <div class="container">
            <div class="wrapper">
                <div class="text-container">
                    <h2>Challenge</h2>
                    <p class="bigger">Take the challenge and test your skills</p>
                    <p class="smaller">0/{{categoryLen}} completed</p>
                </div>
                <div class="scroll">
                    <div class="categories-container">
                        <div class="category" v-for="category in categories" :key="category.name">
                            <img :src="category.image" :alt="category.name" class="challenge-img">
                            <button class="challenge-btn">Play</button>
                        </div>
                </div>
                </div>
    
                <div class="footer">
                    <button @click="goBack">Back</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import categories from '@/lib/categoriesChallenge'

const router = useRouter();


const categoryLen = categories.length;

function goBack() {
    router.back();
}
</script>

<style lang="scss" scoped>
.background-lines {
    background-image: url("../assets/background-play.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100vw;
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
        flex-direction: column;
        position: relative;
    }

    .text-container {
        text-align: center;

        h2 {
            font-size: 56px;
            font-weight: 500;
            margin-bottom: 4px;
        }

        .bigger{
            font-size: 28px;
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
    
                .challenge-img {
                    width: 136px;
                    border: 3px solid #FFBA08;
                    border-radius: 6px;
                }
    
                .challenge-btn {
                    font-size: 20px;
                    padding: 1% 6%;
                    font-weight: 500;
                    background-color: #FFBA08;
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