<template>
    <div class="background-lines">
        <div class="container">
            <div class="wrapper">
                <h2>Profile</h2>
                <div class="scroll">
                    <div class="user-data">
                        <img :src="avatar" alt="User avatar">
                        <div class="username-wrapper">
                            <h4 v-if="!isEditingUsername">{{ username }}</h4>
                            <!--keyup.enter means if user clicks Enter on keyboard, new username will be saved to database-->
                            <input v-else type="text" v-model="newUsername" @keyup.enter="saveUsername" class="username-input">
                            <img src="../assets/edit-icon.svg" alt="Edit" @click="toggleEditMode">
                            <button v-if="isEditingUsername" @click="saveUsername" class="save-button">Save</button>
                        </div>
                        <p>{{ title }}</p>
                        <p>Level {{ level }}</p>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: progressBarWidth }"></div>
                            </div>
                            <p class="xp-to-next">{{ xpToNextLevel }} xp to next level</p>
                        </div>
                    </div>
                    <div class="avatars-container">
                        <h2>Avatars</h2>
                        <div class="images">
                            <img v-for="(av,ind) in userAvatars" :key="ind" :src="av" :class="{ 'selected-avatar': av === avatar }" @click="selectAvatar(av)">
                        </div>

                    </div>
                    <div class="achievements-container">
                        <h2>Achievements</h2>
                        <div v-if="userAchievements.length > 0" class="images">
                            <div class="image-item" v-for="(achiev,ind) in displayedAchievements" :key="ind">
                                <img :src="achiev.image">
                                <div class="hover-overlay">
                                    <p class="description">{{ achiev.description }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p>No achievements yet, checkout <router-link to="/achievements">Achievements</router-link> and conquer the world of words!</p>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { levelData } from '@/lib/levelsData';
import achievements from '@/lib/achievements';
import { database_id, collection_id, collection_user_stats_id, collection_user_avatars_id, collection_user_achievements_id } from '@/lib/constants';

const router = useRouter();
const userStore = useUserStore();


// reactive local state
const isEditingUsername = ref(false);
const newUsername = ref('');

// computed properties mapped from store
const avatar = computed(() => userStore.avatar);
const username = computed(() => userStore.username);
const title = computed(() => userStore.title);
const level = computed(() => userStore.level);
const xp = computed(() => userStore.xp);
const userAchievements = computed(() => userStore.userAchievements);
const userAvatars = computed(() => userStore.userAvatars);

// progress bar calculations
const nextLevelXp = computed(() => {
  const nextLevel = levelData.find(l => l.number === level.value + 1);
  return nextLevel ? nextLevel.xpNeeded : 0;
});
const currentLevelXpNeeded = computed(() => {
  const currentLevel = levelData.find(l => l.number === level.value);
  return currentLevel ? currentLevel.xpNeeded : 0;
});
const xpToNextLevel = computed(() => {
  const remainingXp = nextLevelXp.value - xp.value;
  return remainingXp > 0 ? remainingXp : 0;
});
const progressBarWidth = computed(() => {
  const progress = xp.value - currentLevelXpNeeded.value;
  const totalNeeded = nextLevelXp.value - currentLevelXpNeeded.value;
  const percentage = (progress / totalNeeded) * 100;
  return isNaN(percentage) ? '0%' : `${percentage}%`;
});

// displayed achievements mapped to full objects
const displayedAchievements = computed(() => {
  return userAchievements.value
    .map(name => achievements.find(a => a.name === name))
    .filter(Boolean);
});

// functions
function goBack() {
  router.back();
}

function toggleEditMode() {
  isEditingUsername.value = !isEditingUsername.value;
  if (isEditingUsername.value) newUsername.value = username.value;
}

async function saveUsername() {
  if (!isEditingUsername.value) return;
  await userStore.saveUsername(newUsername.value);
  isEditingUsername.value = false;
}

async function selectAvatar(av) {
  await userStore.selectAvatar(av);
}

// initialize user data on mounted - if user refresh page
onMounted(async () => {
  await userStore.fetchUser();
  await userStore.fetchUserData(database_id,collection_id,collection_user_stats_id,collection_user_avatars_id,collection_user_achievements_id);
});
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

    
    h2 {
        font-size: 36px;
        font-weight: 500;
        margin-bottom: 4px;
        margin-top: 12px;
    }

    .scroll {
        flex: 1; //take up whole space of container wrapper
        overflow-y: auto; //enable vertical scroll
        padding-bottom: 100px;
        width: 100%;

        .user-data {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;
            margin: 20px 40px;
        
            img {
                width: 142px;
            }

            .username-wrapper {
                display: flex;
                gap: 8px;
                justify-content: center;

                h4{
                    font-size: 20px;
                }

                img {
                    width: 24px;
                }

                img:hover {
                    cursor: pointer;
                }
            }

            .progress-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 80%;
                margin-top: 20px;
            }

            .progress-bar {
                width: 100%;
                height: 10px;
                background-color: #d1d1d1;
                border-radius: 5px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background-color: #8c8c8c;
                transition: width 0.5s ease-in-out;
            }

            .xp-to-next {
                font-size: 16px;
                margin-top: 8px;
            }
        }

        .avatars-container {
            .images {
                display: flex;
                gap: 12px;

                img {
                    width: 164px;
                    height: 164px;
                    border: 2px solid black;
                    border-radius: 50%;
                }

                img:hover {
                    cursor: pointer;
                }

                .selected-avatar {
                    border: 4px solid #4ade80;
                    box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
                }
            }
        }

        .achievements-container {
            .images {
                display: flex;
                gap: 12px;
                position: relative;

                .image-item {
                    position: relative;

                    img {
                        width: 180px;
                        height: 180px;
                        border: 2px solid black;
                        border-radius: 6px;
                    }

                    .hover-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 180px;
                        height: 180px;
                        background-color: rgba(0, 0, 0, 0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 6px;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        text-align: center;
                        padding: 10px;
                    }

                    .description {
                        color: #fff;
                        font-size: 16px;
                        font-weight: bold;
                    }

                    &:hover {
                        .hover-overlay {
                            opacity: 1;
                        }
                    }
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