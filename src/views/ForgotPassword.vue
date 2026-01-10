<template>
  <main class="flex min-h-screen w-full items-center justify-center bg-[#f9f9f9] max-[600px]:items-start max-[600px]:py-8">
    <div class="flex min-h-[424px] w-[90%] max-w-[600px] flex-col items-center justify-center rounded-md bg-[#aecde5]/50 p-8 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)] max-[600px]:h-auto max-[600px]:w-[95%] max-[600px]:p-6 max-[600px]:shadow-[2px_2px_8px_2px_rgba(0,0,0,0.2)] md:w-[40%]">
      
      <h2 class="m-0 text-center text-[40px] font-[450] leading-tight max-[600px]:mb-2 min-[601px]:text-[64px]">
        Forgot Password?
      </h2>
      
      <p class="mb-8 text-center text-[14px] min-[601px]:text-[16px]">
        Enter your email to receive a password reset link.
      </p>
      
      <form @submit.prevent="resetPassword" class="flex w-full flex-col items-center gap-4">
        
        <div class="relative w-full max-w-[364px]">
          <img src="../assets/user-icon.svg" alt="user icon" class="absolute left-3 top-1/2 w-6 -translate-y-1/2 opacity-80 min-[601px]:left-4 min-[601px]:w-[30px]">
          <input type="email" v-model="userEmail" placeholder="E-mail" requiredautocomplete="off" class="h-12 w-full rounded-2xl border-none bg-[#6AAED3] py-6 pl-12 pr-4 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-light placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:h-[34px] min-[601px]:py-[24px] min-[601px]:pl-14 min-[601px]:text-[1.1rem]">
        </div>

        <div class="flex w-full max-w-[364px] justify-end pt-1 [text-shadow:0px_4px_4px_rgba(0,0,0,0.3)]">
          <router-link to="/login" class="text-[0.875rem] font-medium text-black no-underline hover:underline">
            Back to Login
          </router-link>
        </div>

        <button type="submit" class="mt-6 cursor-pointer rounded-md border-2 border-black bg-[#2A8DC1] px-10 py-2 text-[20px] font-medium text-white transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] max-[600px]:hover:scale-100 max-[600px]:hover:shadow-none min-[601px]:mt-[22px] min-[601px]:px-[6%] min-[601px]:py-[1%] min-[601px]:text-[24px]">
          Send Link
        </button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { account } from '@/lib/appwrite';
import { toast } from 'vue3-toastify';
import { ref } from 'vue';

const userEmail = ref('');

async function resetPassword() {
    try {
        //for final password update
        const recoveryUrl = window.location.origin + '/reset';
        
        await account.createRecovery(userEmail.value, recoveryUrl);
        toast.success("A password reset link has been sent to your email!");
    } catch (err) {
        console.error('Password reset error: ', err);
        toast.error("Failed to send reset link. Please check your email address.");
    }
}
</script>