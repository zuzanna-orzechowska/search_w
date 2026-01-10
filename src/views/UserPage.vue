<template>
    <div class="relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-[10px] box-border md:p-5"
        :style="{ backgroundImage: `url(${require('@/assets/lines.png')})` }">
        
        <div class="absolute top-[10px] right-5 md:top-5 md:right-[60px]" v-click-outside="() => {dropdownActive = false}">
            <span class="material-symbols-outlined mt-[10px] cursor-pointer rounded-full bg-[#0077b6] text-[64px] md:mt-9" @click="toggleVisibility">account_circle</span>
             <component v-if="dropdownActive" :is="DropdownUser" :username="userStore.username" :avatar="userStore.avatar"/>
        </div>

        <div class="flex flex-col items-center gap-2 text-center md:gap-3">
            <img src="../assets/logo_text.png" alt="SearchW" class="w-[120vw] max-w-[372px] md:ml-[52px] md:w-[444px]">
            
            <div class="w-[90vw] text-center md:ml-[52px] md:w-[408px]">
              <q class="text-[20px] italic md:text-[18px]">The smart, fun way to test your mind and spot every hidden word.</q>
            </div>

            <div class="mt-5 flex flex-col items-center justify-center gap-4 md:ml-[52px] md:mt-6 md:gap-5">
                <button type="button" 
                    class="flex items-center justify-center w-[160px] md:w-[148px] h-[50px] md:h-auto md:p-[2%_10%] bg-[#3291C3] border-2 border-black rounded-md text-[20px] md:text-[24px] font-medium text-black transition-all duration-300 md:hover:scale-110 md:hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] cursor-pointer"
                    @click="goToPlay">
                    Play
                </button>

                <button type="button" 
                    class="flex items-center justify-center w-[160px] md:w-[148px] h-[50px] md:h-auto md:p-[2%_10%] bg-[#FFBA08] border-2 border-black rounded-md text-[20px] md:text-[24px] font-medium text-black transition-all duration-300 md:hover:scale-110 md:hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] cursor-pointer"
                    @click="goToChallenge">
                    Challenge
                </button>

                <button type="button" 
                    class="flex items-center justify-center w-[160px] md:w-[148px] h-[50px] md:h-auto md:p-[2%_10%] bg-[#f9f9f9] border-2 border-black rounded-md text-[20px] md:text-[24px] font-medium text-black transition-all duration-300 md:hover:scale-110 md:hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] cursor-pointer"
                    @click="goToShop">
                    Shop
                </button>
            </div>
        </div>
        <AppFooter />
    </div>
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
import DropdownUser from '@/components/DropdownUser.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { database_id, collection_id, collection_user_stats_id, collection_user_avatars_id, collection_user_achievements_id } from '@/lib/constants';

const router = useRouter();
const userStore = useUserStore();
const dropdownActive = ref(false);

const toggleVisibility = () => {
  dropdownActive.value = !dropdownActive.value;
}

function goToPlay() { router.push('/play'); }
function goToChallenge() { router.push('/challenge'); }
function goToShop() { router.push('/shop'); }

onMounted(async () => {
  localStorage.removeItem('guestProgress');
  await userStore.fetchUser();
  await userStore.fetchUserData(database_id,collection_id,collection_user_stats_id,collection_user_avatars_id,collection_user_achievements_id);
});
</script>