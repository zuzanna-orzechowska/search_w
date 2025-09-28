<template>
    <div class="background-lines">
        <div class="container">
            <div class="wrapper">
                <div class="text-container">
                    <h2>Challenge</h2>
                    <p class="bigger">Take the challenge and test your skills, scroll to show more.</p>
                    <p class="smaller">{{ completedCount }}/{{categoryLen}} completed</p>
                </div>
                <div class="scroll">
                    <div class="categories-container">
                        <div class="category" v-for="category in categories" :key="category.name">
                            <img :src="category.image" :alt="category.name" class="challenge-img">

                            <div class="overlay-txt" v-if="categoryStarsNumber(category.name)"> 
                                <img v-if="categoryStarsNumber(category.name) === 3" class="completed-text" src="../assets/completed-text.svg" alt="completed text">
                                <div class="best-time" v-if="categoryStarsNumber(category.name) < 3">
                                    Best: {{ formatTime(getBestTime(category.name)) }}
                                </div>
                                <div class="stars">
                                     <template v-for="s in 3" :key="s"> <!--adding not strictly HTML element - logic with stars, so it's better to use template than div, div can mess up styling-->
                                        <img v-if="s <= categoryStarsNumber(category.name)" src="../assets/full-star.svg" alt="full star">
                                        <img v-else src="../assets/blank-star.svg" alt="blank star">
                                     </template>
                                </div>
                            </div>

                            <button v-if="!isChallengeCompleted(category.name)" class="challenge-btn" @click="playCategory(category.name)">Play</button>
                            <div v-else>
                                <img src="../assets/tick.svg" alt="tick" class="tick">
                            </div>
                        </div>
                </div>
                </div>
    
                <ButtonFooter />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { databases, account } from '@/lib/appwrite';
import { Query } from 'appwrite';
import categories from '@/lib/categoriesChallenge'
import { handleAchievements } from '@/lib/achievementsHandler';
import ButtonFooter from '@/components/ButtonFooter.vue';

const router = useRouter();
const categoryLen = categories.length;

//variables related to databse
const currentUser = ref(null);
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_progress_id = process.env.VUE_APP_COLLECTION_PROGRESS_CHALLENGE_ID;
const challengesProgress = ref({});
const completedCount = computed(() => { //computer automatically re-evaluates its value whenever one of its dependencies changes
    return Object.values(challengesProgress.value).reduce((count, data) => { //Object takes challengesProgress values and returns them as array like [{ best_time: 175, stars: 3 }
        //reduce iterate thru this array, count is a accumulator and it stars as given 0, data is current data in a loop
        if (data.stars === 3) {
            return count + 1; //adding to completed challenges count 
        }
        return count; //return unchaned count
    }, 0);
});


//functions related to databse
function isChallengeCompleted(name) {
    return challengesProgress.value[name]?.stars === 3; //if user gained 3 stars then challenge is marked completed 
}

function categoryStarsNumber(name) {
    // ?. means checking if the value before it (challengesProgress.value[name]) is not null or undefined
    return challengesProgress.value[name]?.stars || 0;
}

function getBestTime(name) {
    return challengesProgress.value[name]?.best_time;
}
async function fetchChallengeProgress() {
    try {
        const user = await account.get();
        currentUser.value = user;

        //pagination
        let progressDocuments = [];
        let offset = 0;
        const limit = 100;
        let response;

        do {
            response = await databases.listDocuments(database_id, collection_progress_id, [Query.equal('user_id', user.$id),Query.limit(limit),Query.offset(offset)]);
            progressDocuments = progressDocuments.concat(response.documents);
            offset += limit;
        } while (response.documents.length === limit);

        const temp = {};
        progressDocuments.forEach(doc => {
            const categoryName = doc.category;
            const challengeData = JSON.parse(doc.challenge_data);
            temp[categoryName] = challengeData;
        });

        challengesProgress.value = temp;
        
        await handleAchievements({ completedChallengesCount: completedCount.value });

    } catch (err) {
        console.error("Error fetching challenge progress:", err);
    }
}

function formatTime(seconds) {
    if (typeof seconds !== 'number' || seconds < 0) {
        return '00:00';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

function playCategory(name) {
    router.push({path: '/wschallenge', query: {category: name}});
}

onMounted( async () => {
    localStorage.removeItem('challenge-progress');
    fetchChallengeProgress();
})
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
                    flex-direction: column;
                    gap: 12px;
                    border-radius: 6px;
                    
                    .best-time {
                        font-size: 28px;
                        font-weight: 500;
                        color: #FFBA08;
                        text-shadow:
                            -2px -2px 0 #000,
                            2px -2px 0 #000,
                            -2px 2px 0 #000,
                            2px 2px 0 #000,
                            -1px -1px 0 #000,
                            1px -1px 0 #000,
                            -1px 1px 0 #000,
                            1px 1px 0 #000;
                        background-color: rgba(0, 0, 0, 0.4); /* Slightly transparent background for the text */
                        padding: 5px 10px;
                        border-radius: 5px;
                        letter-spacing: 1px; 
                    }

                    .completed-text {
                        border: none;
                    }

                    .stars {
                        
                        img {
                            width: 42px;
                        }
                    }
                }
    
                .challenge-img {
                    width: 180px;
                    border: 4px solid #FFBA08;
                    border-radius: 6px;
                }
    
                .challenge-btn {
                    -webkit-tap-highlight-color: transparent;
                    -webkit-text-fill-color: initial;
                    color: black !important;
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
}

@media (max-width: 600px) {
    .container {
        min-height: 100vh;
        
        .wrapper {
            width: 90vw; 
            height: 95vh;
            box-shadow: none;
        }

        .text-container {
            margin-top: 10px;

            h2 {
                font-size: 40px;
                margin-top: 20px;
            }

            .bigger{
                font-size: 20px; 
            }

            .smaller {
                font-size: 18px;
            }
        }

        .scroll {
            padding-bottom: 80px; 
            
            .categories-container {
                grid-template-columns: repeat(2, 1fr); 
                gap: 5vw; 
                margin-top: 30px;
        
                .category {
                    gap: 3vw;
                    
                    .overlay-txt {
                        width: 140px;
                        height: 140px;
                        gap: 8px;

                        .completed-text {
                            width: 124px;
                        }   

                        .best-time {
                            font-size: 20px; 
                        }

                        .stars {
                            img {
                                width: 30px;
                            }
                        }
                    }
        
                    .challenge-img {
                        width: 140px; 
                        border-width: 3px;
                    }
        
                    .challenge-btn {
                        font-size: 18px; 
                        padding: 3% 8%;
                    }
                }
            }
        }
    }
}

@media (max-width: 992px) {
    .container {
        .scroll {
            .categories-container {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    }
}

@media (min-width: 992px) and (max-width: 1280px) {
    .container {
        .scroll {
            .categories-container {
                grid-template-columns: repeat(3, 1fr);
            }
        }
    }
}
</style>