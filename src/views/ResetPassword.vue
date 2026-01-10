<template>
    <main class="flex min-h-screen w-full items-center justify-center bg-[#f9f9f9] max-[600px]:min-h-auto max-[600px]:items-start max-[600px]:py-8">
        <div class="flex h-[524px] w-[40%] flex-col items-center justify-center rounded-md bg-[#aecde5]/50 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)] max-[600px]:h-auto max-[600px]:w-[90%] max-[600px]:max-w-[400px] max-[600px]:p-[30px_20px_40px_20px] max-[600px]:shadow-[2px_2px_8px_2px_rgba(0,0,0,0.2)]">
            <h2 class="m-0 text-center text-[64px] font-[450] max-[600px]:mb-[10px] max-[600px]:text-[40px]">Reset Password</h2>
            <p class="mb-8 text-center max-[600px]:mb-2 max-[600px]:text-[14px]">Enter your new password below.</p>
            
            <form @submit.prevent="updatePassword" class="flex w-full flex-col items-center gap-4 max-[600px]:gap-[0.8rem]">
                
                <label for="newPassword" class="relative w-full flex justify-center">
                    <div class="relative w-full max-w-[364px]">
                        <img src="../assets/password-icon.svg" alt="password icon" class="absolute left-3 top-1/2 w-6 -translate-y-1/2 opacity-90 min-[601px]:left-4 min-[601px]:w-7">
                        <input 
                            v-if="hidPassword" type="password" id="newPassword" name="newPassword" placeholder="New Password" v-model="newPassword" autocomplete="off" required
                            class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-14 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:pl-14 min-[601px]:text-[1.1rem]"
                        >
                        <input 
                            v-else type="text" id="newPassword" name="newPassword" placeholder="New Password" v-model="newPassword" autocomplete="off" required
                            class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-14 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:pl-14 min-[601px]:text-[1.1rem]"
                        >
                        <button class="absolute right-0 top-0 flex h-full w-12 cursor-pointer items-center justify-center rounded-r-[16px] bg-transparent p-0 max-[600px]:w-[50px]" @click.prevent="toggleState">
                            <img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="w-6 min-[601px]:w-8">
                        </button>
                    </div>
                </label>

                <label for="confirmPassword" class="relative w-full flex justify-center">
                    <div class="relative w-full max-w-[364px]">
                        <img src="../assets/password-icon.svg" alt="password icon" class="absolute left-3 top-1/2 w-6 -translate-y-1/2 opacity-90 min-[601px]:left-4 min-[601px]:w-7">
                        <input 
                            v-if="hidPassword" type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" v-model="confirmPassword" autocomplete="off" required
                            class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-14 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:pl-14 min-[601px]:text-[1.1rem]"
                        >
                        <input 
                            v-else type="text" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" v-model="confirmPassword" autocomplete="off" required
                            class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-14 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:pl-14 min-[601px]:text-[1.1rem]"
                        >
                        <button class="absolute right-0 top-0 flex h-full w-12 cursor-pointer items-center justify-center rounded-r-[16px] bg-transparent p-0 max-[600px]:w-[50px]" @click.prevent="toggleState">
                            <img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="w-6 min-[601px]:w-8">
                        </button>
                    </div>
                </label>

                <button 
                    type="submit" 
                    class="mt-[22px] cursor-pointer rounded-md border-2 border-black bg-[#2A8DC1] p-[1%_6%] text-[24px] font-medium text-white transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] max-[600px]:mt-5 max-[600px]:p-[4px_12px] max-[600px]:text-[20px] max-[600px]:hover:scale-100 max-[600px]:hover:shadow-none"
                >
                    Reset Password
                </button>
            </form>

            <router-link to="/login" class="pt-6 text-center text-[0.875rem] font-medium text-black no-underline [text-shadow:0px_4px_4px_rgba(0,0,0,0.3)] max-[600px]:pt-[15px] max-[600px]:text-[14px]">
                Back to Login
            </router-link>
        </div>
    </main>
</template>

<script setup>
import { account } from '@/lib/appwrite';
import { toast } from 'vue3-toastify';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const newPassword = ref('');
const confirmPassword = ref('');
const hidPassword = ref(true);

const route = useRoute();

const userId = ref('');
const secret = ref('');

onMounted(() => {
    //extracting userId and secret from the URL query parameters
    userId.value = route.query.userId || '';
    secret.value = route.query.secret || '';
});

async function updatePassword() {
    if (newPassword.value !== confirmPassword.value) {
        toast.error("Passwords do not match.");
        return;
    }

    try {
        await account.updateRecovery(userId.value, secret.value, newPassword.value, confirmPassword.value);
        toast.success("Password has been successfully updated!");
    } catch (err) {
        console.error('Password reset error: ', err);
        toast.error("An error occurred. Please try again.");
    }
}

function toggleState() {
    hidPassword.value = !hidPassword.value;
}
</script>