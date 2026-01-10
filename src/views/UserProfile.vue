<template>
    <div 
        class="h-screen w-screen bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${require('@/assets/background-play.png')})` }"
    >
        <div class="flex min-h-screen items-center justify-center">
            <div class="relative flex h-[90vh] w-[60vw] flex-col items-center rounded-md bg-[#aecde5]/50 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)] backdrop-blur-[20px] max-[992px]:w-[90vw] max-[600px]:h-[95vh] max-[600px]:w-[95vw] max-[600px]:rounded-none max-[600px]:shadow-none">
                
                <h2 class="mt-3 mb-1 text-[56px] font-medium max-[600px]:mt-5 max-[600px]:text-[40px]">Profile</h2>
                
                <div class="flex-1 w-full overflow-y-auto pb-[100px] max-[600px]:pb-20">
                    
                    <div class="mx-10 my-5 flex flex-col items-center gap-3 max-[600px]:mx-[10px] max-[600px]:gap-2">
                        <img :src="avatar" alt="User avatar" class="w-[142px] rounded-full border-2 border-black max-[600px]:w-[100px]">
                        
                        <div class="flex justify-center gap-2 max-[600px]:gap-[6px]">
                            <h4 v-if="!isEditingUsername" class="text-[28px] font-semibold max-[600px]:text-[24px]">{{ username }}</h4>
                            <input v-else type="text" v-model="newUsername" @keyup.enter="saveUsername" class="rounded-md border border-gray-400 px-2 text-[28px] max-[600px]:text-[24px] bg-white/50 focus:outline-none">
                            <img src="../assets/edit-icon.svg" alt="Edit" @click="toggleEditMode" class="w-6 cursor-pointer max-[600px]:w-5">
                            <img v-if="isEditingUsername" @click="saveUsername" src="../assets/tick.svg" alt="tick" class="w-6 cursor-pointer max-[600px]:w-5">
                        </div>
                        
                        <p class="text-[20px] italic max-[600px]:text-[16px]">{{ title }}</p>
                        <p class="text-[24px] max-[600px]:text-[20px]">Level <span class="font-medium">{{ level }}</span></p>
                        
                        <div class="mt-3 flex w-[80%]" :class="'flex-col items-center max-[600px]:w-[90%] max-[600px]:mt-2'">
                            <div class="h-[10px] w-full overflow-hidden rounded-[5px] bg-[#AED2E5]">
                                <div class="h-full bg-[#0077B6] transition-[width] duration-500 ease-in-out" :style="{ width: progressBarWidth }"></div>
                            </div>
                            <p class="mt-2 text-[16px] text-[#595858] max-[600px]:text-[14px]">{{ xpToNextLevel }} xp to next level</p>
                        </div>
                    </div>

                    <div class="mx-10 my-[42px] max-[600px]:mx-[10px] max-[600px]:my-[30px]">
                        <h4 class="mb-6 text-[24px] font-medium max-[600px]:mb-4 max-[600px]:text-[20px]">Avatars</h4>
                        <div class="grid grid-cols-5 gap-2 max-[1280px]:grid-cols-3 max-[992px]:grid-cols-3 max-[600px]:grid-cols-3 max-[600px]:gap-[10px]">
                            <img 
                                v-for="(av,ind) in userAvatars" :key="ind" 
                                :src="av" 
                                @click="selectAvatar(av)"
                                class="h-[164px] w-[164px] cursor-pointer rounded-full border-2 border-black transition-all max-[600px]:h-[90px] max-[600px]:w-[90px] max-[600px]:border-[1px]"
                                :class="{ 'border-4 !border-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.5)] max-[600px]:border-[3px]': av === avatar }"
                            >
                        </div>
                    </div>

                    <div class="mx-10 my-[42px] max-[600px]:mx-[10px] max-[600px]:my-[30px]">
                        <h4 class="mb-6 text-[24px] font-medium max-[600px]:mb-4 max-[600px]:text-[20px]">Achievements</h4>
                        <div v-if="userAchievements.length > 0" class="grid grid-cols-5 gap-4 max-[1280px]:grid-cols-3 max-[992px]:grid-cols-3 max-[600px]:grid-cols-3 max-[600px]:gap-3">
                            <div class="group relative flex justify-center" v-for="(achiev,ind) in displayedAchievements" :key="ind">
                                <img :src="achiev.image" class="h-[180px] w-[180px] rounded-md border-2 border-black max-[600px]:h-[110px] max-[600px]:w-[110px]">
                                <div class="absolute top-0 flex h-[180px] w-[180px] items-center justify-center rounded-md bg-black/60 p-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-[600px]:h-[110px] max-[600px]:w-[110px] max-[600px]:p-1">
                                    <p class="text-center text-[16px] font-bold text-white max-[600px]:text-[12px]">{{ achiev.description }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center">
                            <p class="text-[18px]">No achievements yet, checkout <router-link to="/achievements" class="font-medium text-black">Achievements</router-link> and conquer the world of words!</p>
                        </div>
                    </div>
                </div>
    
               <ButtonFooter />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { levelData } from '@/lib/levelsData';
import achievements from '@/lib/achievements';
import ButtonFooter from '@/components/ButtonFooter.vue';
import { database_id, collection_id, collection_user_stats_id, collection_user_avatars_id, collection_user_achievements_id } from '@/lib/constants';

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