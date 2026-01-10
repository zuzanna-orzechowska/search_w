<template>
    <div class="flex min-h-screen w-screen items-center justify-center bg-[#aed2e5]">
        <div class="mx-auto flex w-full flex-col items-center bg-[#aed2e5] px-2 min-[601px]:w-auto">
            <h2 class="mt-3 mb-4 text-[40px] font-medium min-[601px]:mb-4 min-[601px]:text-[56px]">Settings</h2>
            
            <div class="flex w-full flex-col gap-10 px-[10px] min-[601px]:gap-8 min-[601px]:px-0">
                <div class="flex flex-col gap-2 min-[601px]:gap-1">
                    <h1 class="text-[1.5rem] font-medium min-[601px]:text-[2rem]">Change password</h1>
                    <p class="text-[0.95rem] min-[601px]:text-base text-[#333]">Set a unique password to protect your account.</p>

                    <form v-if="isEditingPassword" @submit.prevent="changePassword" class="w-full pr-[10px] min-[601px]:w-auto min-[601px]:pr-0">
                        
                        <div class="relative mt-6 w-full max-w-[364px]">
                            <img src="../assets/password-icon.svg" alt="password-icon" class="absolute left-3 top-1/2 w-6 -translate-y-1/2 min-[601px]:left-4 min-[601px]:w-7">
                            <input 
                                :type="hidPassword ? 'password' : 'text'" id="oldPassword" name="oldPassword" placeholder="Old Password" v-model="oldPassword" autocomplete="off" required
                                class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-12 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:pl-14 min-[601px]:pr-16 min-[601px]:text-[18px]"
                            >
                            <button class="absolute right-0 top-0 flex h-full w-12 cursor-pointer items-center justify-center rounded-r-[16px] bg-transparent p-0 min-[601px]:w-14" @click.prevent="toggleState">
                                <img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="w-6 min-[601px]:w-7">
                            </button>
                        </div>

                        <div class="relative mt-6 w-full max-w-[364px]">
                            <img src="../assets/password-icon.svg" alt="password-icon" class="absolute left-3 top-1/2 w-6 -translate-y-1/2 min-[601px]:left-4 min-[601px]:w-7">
                            <input 
                                :type="hidPassword ? 'password' : 'text'" id="newPassword" name="newPassword" placeholder="New Password" v-model="newPassword" autocomplete="off" required
                                class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-12 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:pl-14 min-[601px]:pr-16 min-[601px]:text-[18px]"
                            >
                            <button class="absolute right-0 top-0 flex h-full w-12 cursor-pointer items-center justify-center rounded-r-[16px] bg-transparent p-0 min-[601px]:w-14" @click.prevent="toggleState">
                                <img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="w-6 min-[601px]:w-7">
                            </button>
                        </div>

                        <button type="submit" class="mt-4 w-[100px] cursor-pointer rounded-md border-2 border-black bg-[#f9f9f9] py-1 text-[18px] font-medium transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] min-[601px]:mt-6 min-[601px]:w-24 min-[601px]:py-[4px] min-[601px]:text-base">Confirm</button>
                    </form>
                    
                    <button v-else @click="isEditingPassword = true" class="mt-4 w-[100px] cursor-pointer rounded-md border-2 border-black bg-[#f9f9f9] py-1 text-[18px] font-medium transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] min-[601px]:mt-6 min-[601px]:w-24 min-[601px]:py-[4px] min-[601px]:text-base">Change</button>
                </div>

                <div class="flex flex-col gap-2 min-[601px]:gap-1">
                    <h1 class="text-[1.5rem] font-medium min-[601px]:text-[2rem]">Delete account</h1>
                    <p class="text-[0.95rem] min-[601px]:text-base text-[#333]">Your account will be permanently deleted from SearchW.</p>
                    <p class="text-[0.95rem] min-[601px]:text-base text-[#333]">If you wish to delete your account, please inform the administrator.</p>
                    <a :href="mailToLink" class="w-auto font-bold text-black no-underline hover:text-[#2A8DC1] min-[601px]:w-[250px]">Click here to send an email.</a>
                </div>
            </div>

            <div class="mt-10 flex h-auto w-[200px] items-center justify-center gap-6 rounded-[24px] border-4 border-black bg-[#57A4CD] py-1 min-[601px]:mt-12 min-[601px]:w-[280px]">
                <img @click="goBack" src="../assets/home-icon.svg" alt="home icon" class="w-9 cursor-pointer min-[601px]:w-[44px]">
            </div>
        </div>
    </div>
</template>

<script setup>
import { account } from '@/lib/appwrite';
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';

const router = useRouter();

const currentUser = ref(null);
const isEditingPassword = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const hidPassword = ref(true);
const passwordError = ref(false);

const adminEmail = process.env.VUE_APP_EMAIL_ADMIN;
const subject = "Account Deletion Request";
const body = "Hello Administrator,%0A%0AI would like to request the deletion of my account.%0A%0AUsername:%20[Your Username]%0AEmail:%20[Your Email]%0A%0AThank you.";

const mailToLink = computed(() => {
  return `mailto:${adminEmail}?subject=${subject}&body=${body}`;
});

function toggleState() {
    hidPassword.value = !hidPassword.value;
}

function isPasswordValid() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(newPassword.value);
}

async function changePassword() {
    if (!isPasswordValid()) {
        passwordError.value = true;
        toast.error("Incorrect password! It must be at least 8 characters, with uppercase, lowercase, number and special character.");
        return;
    } else {
        passwordError.value = false;
    }

    try {
        await account.updatePassword(newPassword.value, oldPassword.value);
        toast.success("Password was changed successfully!");
        isEditingPassword.value = false;
        oldPassword.value = '';
        newPassword.value = '';
    } catch (err) {
        console.error("Failed to change password:", err);
        toast.error("Failed to change password: " + err.message);
    }
}

async function getUser() {
    try {
        currentUser.value = await account.get();
    } catch (err) {
        console.error("Failed to fetch user:", err);
    }
}

function goBack() {
    router.back();
}

onMounted(async () => {
    getUser();
});
</script>