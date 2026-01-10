<template>
    <main class="flex min-h-screen w-full items-center justify-center bg-[#f9f9f9] max-[600px]:min-h-auto max-[600px]:items-start max-[600px]:py-[30px]">
        <div class="relative flex h-[524px] w-[90%] max-w-[400px] flex-col items-center justify-center rounded-md bg-[#aecde5]/50 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)] md:w-[40%] md:max-w-none max-[600px]:p-[30px_20px] max-[600px]:shadow-[2px_2px_8px_2px_rgba(0,0,0,0.2)]">
            <h2 class="my-8 text-center text-[48px] font-[450] md:text-[64px] max-[600px]:my-5">Login</h2>
            
            <form @submit.prevent="login" class="flex flex-col items-center gap-4 w-full">
                <div class="relative w-full max-w-[364px]">
                    <img src="../assets/user-icon.svg" alt="user icon" class="absolute left-3 top-1/2 w-6 -translate-y-1/2 opacity-90 min-[601px]:left-4 min-[601px]:w-7">
                    <input type="email" id="userLogin" name="userLogin" placeholder="E-mail" v-model="userLogin" autocomplete="off" required
                        class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-4 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:h-[48px] min-[601px]:pl-14 min-[601px]:text-[1.1rem]"
                    >
                </div>

                <div class="relative w-full max-w-[364px]">
                    <img src="../assets/password-icon.svg" alt="password-icon" class="absolute left-3 top-1/2 w-6 -translate-y-1/2 opacity-90 min-[601px]:left-4 min-[601px]:w-7">
                    <input 
                        :type="hidPassword ? 'password' : 'text'" id="passwordLogin" name="Password" placeholder="Password" v-model="password" autocomplete="off" required
                        class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-14 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:h-[48px] min-[601px]:pl-14 min-[601px]:text-[1.1rem]"
                    >
                    <button class="absolute right-0 top-0 flex h-full w-12 cursor-pointer items-center justify-center rounded-r-[16px] bg-transparent p-0" @click.prevent="toggleState">
                        <img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="w-6 min-[601px]:w-7">
                    </button>
                </div>

                <div class="mt-3 flex w-full max-w-[364px] items-center justify-between text-[14px] min-[601px]:text-[16px] [text-shadow:0px_4px_4px_rgba(0,0,0,0.3)]">
                    <label for="rememberLogin" class="flex cursor-pointer items-center gap-1">
                        <input type="checkbox" id="rememberLogin" v-model="rememberMe" class="h-4 w-4 cursor-pointer accent-[#0077b6]">
                        Remember me
                    </label>
                    <span @click="router.push('/forgot')" class="cursor-pointer">Forgot password?</span>
                </div>

                <button type="submit" class="mt-[22px] cursor-pointer rounded-md border-2 border-black bg-[#2A8DC1] px-10 py-2 text-[20px] font-medium text-white transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] min-[601px]:text-[24px] max-[600px]:hover:scale-100 max-[600px]:hover:shadow-none">
                    Login
                </button>
            </form>

            <p class="mb-4 mt-8 text-center text-[14px] min-[601px]:text-base">
                Don't have an account? Sign up <router-link to="/register" class="font-medium text-black">here</router-link>
            </p>
            <router-link to="/" class="font-medium text-black no-underline">Back to Home</router-link>
        </div>
    </main>
</template>

<script setup>
import { account} from '@/lib/appwrite';
import { toast } from 'vue3-toastify';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

//dynamic variables
const userLogin = ref('');
const password = ref('');
let hidPassword = ref(true);
let rememberMe = ref(false);

const router = useRouter();

async function login() {
    try {
        await account.createEmailPasswordSession(userLogin.value,password.value);
        router.push('/user');

        if (!rememberMe.value) {
            await account.deleteSession('current');
        } 
    } catch(err) {
        console.log('Error: ',err);
        if (err.code === 401) {
            toast.error("Invalid username or email");
        }
    }
}

function toggleState() {
    hidPassword.value = !hidPassword.value;
}
</script>