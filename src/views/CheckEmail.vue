<template>
    <div class="grid h-screen w-screen place-items-center bg-[#AED2E5]">
        <div class="flex w-[80%] flex-col items-center gap-5 rounded-xl bg-[#f9f9f9] p-10 text-center shadow-[0_4px_15_rgba(0,0,0,0.1)] min-[601px]:w-auto min-[601px]:p-[80px_60px]">
            <h2 class="m-0 max-w-[400px] text-[20px] text-[#333] min-[601px]:text-[28px] font-bold">Hello! Please check your email to verify your account.</h2>
            <p class="text-[18px] min-[601px]:text-[20px]">We've sent the verification link to: {{ verificationEmail }}</p>
            <p class="text-[18px] min-[601px]:text-[20px]">If you don't see the email, check your spam folder.</p>
            <img src="../assets/blueFluff.svg" alt="blueFluff" class="w-[150px]">
            
             <div @click="signOut" class="flex cursor-pointer items-center gap-3 border-b border-black pb-2">
                <img src="../assets/sign-out-icon.svg" alt="Sign out icon" class="w-[30px]">
                <p class="text-[18px]">Sign out</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { account } from '@/lib/appwrite';
import { useRouter } from 'vue-router';
const userStore = useUserStore();
const verificationEmail = computed(() => userStore.verificationEmail);
const router = useRouter();
async function signOut() {
    try {
         await account.deleteSession('current');
         userStore.$reset(); 
         router.push('/');
     } catch (err) {
         console.error('Logout error:', err);
    }
}
</script>