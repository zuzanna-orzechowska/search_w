<template>
    <div class="absolute right-5 z-[1] mt-2 flex h-[304px] w-[300px] flex-col items-center justify-center gap-[42px] rounded-md bg-[#AED2E5]/50 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)] backdrop-blur-[20px]">
        <div class="flex flex-col items-center gap-3">
            <p class="w-[224px] text-center text-[20px]">Come back to word searching’s journey</p>
            <button class="w-[100px] cursor-pointer rounded-md border-2 border-black bg-[#2A8DC1] py-[1%] px-[6%] text-[18px] font-medium transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)]" @click="toLogin">Sign in</button>
        </div>
        <div class="flex flex-col items-center gap-3">
            <p class="w-[224px] text-center text-[20px]">Don’t have an account?</p>
            <button class="w-[100px] cursor-pointer rounded-md border-2 border-black bg-[#f9f9f9] py-[1%] px-[6%] text-[18px] font-medium transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)]" @click="toRegister">Sign up</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const toLogin = () => {
  router.push('/login');
}

const toRegister = async () => {
  router.push('/register');
}
</script>