<template>
  <div class="relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-[10px] box-border md:p-5"
    :style="{ backgroundImage: `url(${require('@/assets/lines.png')})` }">
    <div class="absolute top-[10px] right-5 md:top-5 md:right-[60px]" v-click-outside="() => { dropdownActive = false }">
         <!--v-click-outside directive from https://medium.com/@stjepan.crncic/crafting-a-simple-click-outside-directive-in-vue-3-980c55ab1a65-->
      <span class="material-symbols-outlined mt-[10px] cursor-pointer rounded-full bg-[#0077b6] text-[64px] md:mt-9" @click="toggleVisibility">account_circle</span>
      <!--is dynamically loads given component if the requirement is met-->
      <component v-if="dropdownActive" :is="DropdownGuest" />
    </div>
    <div class="flex flex-col items-center gap-2 text-center md:gap-3">
      <img src="../assets/logo_text.png" alt="SearchW" class="w-[96vw] max-w-[372px] md:ml-[52px] md:w-[444px]">
      <div class="w-[90vw] text-center md:ml-[52px] md:w-[408px]">
        <q class="text-[20px] italic md:text-[18px]">The smart, fun way to test your mind and spot every hidden word.</q>
      </div>

      <div class="mt-5 flex flex-col items-center justify-center gap-4 md:ml-[52px] md:mt-6 md:gap-5">
        <button type="button" class="w-[110px] cursor-pointer rounded-md border-2 border-black bg-[#3291C3] py-1 text-[20px] font-medium text-black md:w-[148px] md:p-[1%_6%] md:text-[24px] transition-all duration-300 md:hover:scale-110 md:hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)]"
          @click="toLogin">Sign in</button>
        
        <button type="button" class="w-[110px] cursor-pointer rounded-md border-2 border-black bg-[#f9f9f9] py-1 text-[20px] font-medium text-black md:w-[148px] md:p-[1%_6%] md:text-[24px] transition-all duration-300 md:hover:scale-110 md:hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)]"
          @click="randomCategory">Random</button>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
import DropdownGuest from '@/components/DropdownGuest.vue';
import { useRouter } from 'vue-router';
import categories from '@/lib/categoriesPlay';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const router = useRouter();
const completedCategories = ref(0);
const dropdownActive = ref(false);

const toggleVisibility = () => {
  dropdownActive.value = !dropdownActive.value;
}

const toLogin = () => {
    router.push('/login');
}

function randomCategory() {
    if (completedCategories.value === 1) {
        toast.error("You've completed random puzzle. Please sign in to save your progress and unlock more!");
        return;
    }
    const ind = Math.floor(Math.random() * categories.length);
    const randomCategory = categories[ind];
    router.push({path: '/random', query: {category: randomCategory.name}})
}

onMounted(() => {
    const savedProgress = localStorage.getItem('guestProgress');
    if (savedProgress) {
        completedCategories.value = parseInt(savedProgress);
    }
});

</script>