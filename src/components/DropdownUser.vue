<template>
    <div class="absolute right-5 z-[1] mt-2 flex h-[444px] w-[300px] flex-col items-center justify-center gap-3 rounded-md bg-[#AED2E5]/50 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)] backdrop-blur-[20px]">
        <div class="flex flex-col items-center gap-3">
            <p class="w-[224px] text-center text-[20px]">Welcome {{userStore.username}}</p>
            <img :src="userStore.avatar" alt="User avatar" class="w-20 rounded-full py-2">
        </div>
        <div class="flex w-[254px] flex-col gap-3">
            <div class="flex cursor-pointer items-center gap-3 border-b border-black pb-2" @click="router.push('/profile')">
                <img src="../assets/profile-icon.svg" alt="Profile icon" class="w-[30px]">
                <p class="text-[18px]">Profile</p>
            </div>
            <div class="flex cursor-pointer items-center gap-3 border-b border-black pb-2" @click="router.push('/achievements')">
                <img src="../assets/achievements-icon.svg" alt="Achievements icon" class="w-[30px]">
                <p class="text-[18px]">Achievements</p>
            </div>
            <div class="flex cursor-pointer items-center gap-3 border-b border-black pb-2" @click="router.push('/settings')">
                <img src="../assets/settings-icon.svg" alt="Settings icon" class="w-[30px]">
                <p class="text-[18px]">Settings</p>
            </div>
            <div class="flex cursor-pointer items-center gap-3 border-b border-black pb-2" @click="router.push('/help')">
                <img src="../assets/help-icon.svg" alt="Help icon" class="w-[30px]">
                <p class="text-[18px]">Help</p>
            </div>
            <div @click="signOut" class="flex cursor-pointer items-center gap-3 border-none pb-2">
                <img src="../assets/sign-out-icon.svg" alt="Sign out icon" class="w-[30px]">
                <p class="text-[18px]">Sign out</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { account } from '@/lib/appwrite';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

//functions
async function signOut() {
    try {
         await account.deleteSession('current');
         router.push('/');
     } catch (err) {
         console.error('Logout error:', err);
    }
}
</script>