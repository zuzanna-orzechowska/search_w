<template>
    <div class="background-lines">
        <div class="container">
            <div class="wrapper">
                <div class="text-container">
                    <h2>Play</h2>
                    <p class="bigger">Choose a category</p>
                    <p class="smaller">{{ completedLen }} / {{ categoryLen }} completed</p>
                </div>
                <div class="scroll">
                    <div class="categories-container">
                        <div class="category" v-for="category in categories" :key="category.name">
                            <img :src="category.image" :alt="category.name">

                            <div class="overlay-txt" v-if="isCategoryCompleted(category.name)"> 
                                <img src="../assets/completed-text.svg" alt="completed text">
                            </div>

                            <button v-if="!isCategoryCompleted(category.name)" @click="playCategory(category.name)">Play</button>
                            <div v-else>
                                <img src="../assets/tick.svg" alt="tick" class="tick">
                            </div>
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
import categories from '@/lib/categoriesPlay';
import { ref, onMounted } from 'vue';
import { databases, account } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { handleAchievements } from '@/lib/achievementsHandler';

const router = useRouter();

const categoryLen = categories.length;
const completedLen = ref(0);
const completedCategories = ref({}); //stored data to check if given category is completed

const currentUser = ref(null);
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_PLAY_ID;
const collection_progress_id = process.env.VUE_APP_COLLECTION_PROGRESS_PLAY_ID;


//checking if given category is completed
function isCategoryCompleted(name) {
    return !!completedCategories.value[name.toLowerCase()]; //!! means that variable will always be boolean not null or undefined
}

//fetching puzzles and it's stages with progress
async function fetchPuzzlesProgress() {
    try {
        const user = await account.get();
        currentUser.value = user;
        // console.log("Current user:", user);

        //listing all documents related with progress in Play puzzles
        //{ documents: progressDocument} takes the property documents from the returned object and renames it to progressDocuments
        const { documents: progressDocuments } = await databases.listDocuments(database_id, collection_progress_id,[Query.equal('user_id', user.$id)]);

        const { documents: puzzleDocuments } = await databases.listDocuments(database_id,collection_id);

        // console.log("Progress documents:", progressDocuments);
        // console.log("Puzzle documents:", puzzleDocuments);

        //checking how many stages does puzzle have so it will be easier to mark category as completed
        const maxStages = {};
        puzzleDocuments.forEach(doc => {
            const categoryName = doc.title.toLowerCase().trim(); //normalizing text
            const stageNumber = parseInt(doc.puzzleId.split('-')[1]); //puzzleId is like 'fruit-1' and we only need number
            if (!maxStages[categoryName] || stageNumber > maxStages[categoryName]) {
                maxStages[categoryName] = stageNumber;
            }
        });

        // console.log(" Max stages per category (from puzzleDocuments):", maxStages);

        //firstly all of the categories are marked as uncompleted
        categories.forEach(cat => {
            completedCategories.value[cat.name.toLowerCase().trim()] = false;
        });

        //checking progress
        progressDocuments.forEach(doc => {
            const categoryName = doc.category.toLowerCase().trim();
            const stagesData = JSON.parse(doc.stages_data);

            //getting the total number of stages for the category
            const totalStages = maxStages[categoryName]; 

            if (!totalStages) {
                return;
            }
            
            //checking if the final stage has been completed in the user's progress
            const finalStageProgress = stagesData[totalStages];

            const isCompleted = finalStageProgress?.completed === true;

            completedCategories.value[categoryName] = isCompleted;
        });

        completedLen.value = Object.values(completedCategories.value).filter(Boolean).length;
        // console.log("Completed categories:", completedCategories.value);
        // console.log("completedLen:", completedLen.value);
        await handleAchievements({ completedCategoriesCount: completedLen.value });

    } catch (err) {
        console.error("Error fetching puzzle progress:", err);
    }
}


// other functions
function goBack() {
    router.back();
}

function playCategory(name) {
    router.push({ path: '/wsplay', query: { category: name } });
}

onMounted(fetchPuzzlesProgress);
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
            margin-top: 12px;
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
            grid-template-columns: repeat(4,1fr);
            gap: 2vw;
            margin-top: 42px;
    
            .category {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1vw;

                .overlay-txt {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 180px;
                    height: 180px;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 6px;
                    
                    img {
                        border: none;
                        padding: 0px 12px;
                    }
                }
    
                img {
                    width: 180px;
                    border: 2px solid black;
                    border-radius: 6px;
                }

                .tick {
                    border: none;
                    width: 42px;
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