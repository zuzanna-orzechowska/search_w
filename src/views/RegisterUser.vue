<template>
    <main class="flex min-h-screen w-full items-center justify-center bg-[#f9f9f9] max-[600px]:min-h-auto max-[600px]:items-start max-[600px]:py-[30px]">
        <div class="relative flex h-auto min-h-[740px] w-[90%] max-w-[400px] flex-col items-center justify-center rounded-md bg-[#aecde5]/50 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.3)] md:w-[40%] md:max-w-none max-[600px]:p-[30px_20px_40px_20px] max-[600px]:shadow-[2px_2px_8px_2px_rgba(0,0,0,0.2)]">
            <h2 class="my-4 text-center text-[48px] font-[450] md:text-[64px] max-[600px]:mt-[10px] max-[600px]:mb-5">Register</h2>
            <!--instead of submiting form and reloading page function register will be called - register user within database-->
            <form @submit.prevent="register" class="flex flex-col items-center gap-4 w-full">
                
                <div class="flex flex-col items-center justify-center">
                    <!--v-bind is a directive that cooperate with JS - change avatar icon depending on a choice - default is "+", any other is user choice
                    v-on (short is @) is a directive that handles DOM events and run handlers when triggered - in this case via click event ;
                    showing/hidding pannel with avatars when clicked-->
                    <img v-bind:src="selectedAvatar || require('../assets/avatar-icon.svg')" v-on:click="avatars = !avatars" alt="plus" class="w-[100px] cursor-pointer max-[600px]:w-20 max-[600px]:mb-[10px]">
                     <!--v-if is a directive that checks if given condition is met - if yes then the div is visible-->
                    <div v-if="avatars" class="absolute bottom-[116px] z-[10] flex w-[700px] flex-col items-center gap-6 rounded-[24px] bg-[#79AED3] py-6 max-[600px]:bottom-[164px] max-[600px]:w-[95vw] max-[600px]:max-w-[350px] max-[600px]:gap-[15px] max-[600px]:p-[15px_10px]">
                        <p class="text-[24px] font-[300] text-[#f9f9f9] max-[600px]:text-[18px]">Choose an avatar</p>
                        <div class="grid grid-cols-4 gap-6 max-[600px]:grid-cols-3 max-[600px]:gap-3">
                            <!-- v-for is a directive that renders a list - in this case it presents all of avatars from array - the key is their indexes
                             :key attribute is used so Vue can tell the elements apart properly, unique identifying
                             v:bind takes proper img url - the chosen one, v-of uses chooseAvatar method that replace default plus icon with selected image-->
                            <img v-for="(av,ind) in avatarsArr" :key="ind" v-bind:src="av" v-on:click="chooseAvatar(av)" class="h-[100px] w-[100px] cursor-pointer rounded-full transition-all duration-300 hover:scale-110 max-[600px]:h-[70px] max-[600px]:w-[70px] max-[600px]:hover:scale-100">
                        </div>
                    </div>
                </div>

                <div class="relative w-full max-w-[364px]">
                    <img src="../assets/user-icon.svg" alt="user icon" class="absolute left-3 top-6 w-6 -translate-y-1/2 opacity-90 min-[601px]:left-4 min-[601px]:w-7">
                     <!--v-model is used because it connects value of this input with value of variable in script-->
                    <input type="text" id="usernameRegister" name="Username" placeholder="Username *" v-model="username" required autocomplete="off" ref="usernameInput"
                        class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-4 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:pl-14 min-[601px]:text-[1.1rem]">
                    <p class="mt-1 hidden text-[12px] text-[#9c0606] pl-10 min-[601px]:pl-12" :class="{'!block': username.length > 21}">Username can't be longer than 21 characters!</p>
                </div>

                <div class="relative w-full max-w-[364px]">
                    <img src="../assets/email-icon.svg" alt="email icon" class="absolute left-3 top-6 w-6 -translate-y-1/2 opacity-90 min-[601px]:left-4 min-[601px]:w-7">
                    <!--@blur calls given method when input is out of focus-->
                    <input @blur="isEmailCorrect" type="email" id="emailRegister" name="Email" placeholder="E-mail *" v-model="email" required autocomplete="off" ref="emailInput"
                        class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-4 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:pl-14 min-[601px]:text-[1.1rem]">
                    <p class="mt-1 hidden text-[12px] text-[#9c0606] pl-10 min-[601px]:pl-12" :class="{'!block' : emailError}">Invalid e-mail address!</p>
                </div>

                <div class="relative w-full max-w-[364px]">
                    <img src="../assets/password-icon.svg" alt="password-icon" class="absolute left-3 top-6 w-6 -translate-y-1/2 opacity-90 min-[601px]:left-4 min-[601px]:w-7">
                    <input @blur="isPassworValid" :type="hidPassword ? 'password' : 'text'" id="passwordRegister" name="Password" placeholder="Password" v-model="password" autocomplete="off" required
                        class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-14 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:pl-14 min-[601px]:text-[1.1rem]">
                    <button class="absolute right-0 top-0 flex h-[48px] w-12 cursor-pointer items-center justify-center rounded-r-[16px] bg-transparent p-0" @click.prevent="toogleState">
                        <img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="w-6 min-[601px]:w-7">
                    </button>
                    <p class="mt-1 hidden text-[12px] text-[#9c0606] pl-10 min-[601px]:pl-12 w-full" :class="{'!block' : passwordError}">Incorrect password! It must be at least 8 characters, with uppercase, lowercase, number and special character.</p>
                </div>

                <div class="relative w-full max-w-[364px]">
                    <img src="../assets/password-icon.svg" alt="password-icon" class="absolute left-3 top-6 w-6 -translate-y-1/2 opacity-90 min-[601px]:left-4 min-[601px]:w-7">
                    <input @blur="isPasswordMatch" :type="hidPassword ? 'password' : 'text'" id="confirmPasswordRegister" name="ConfirmPassword" placeholder="Confirm Password *" v-model="confirmPassword" autocomplete="off" required
                        class="h-[48px] w-full rounded-[16px] bg-[#6AAED3] pl-12 pr-14 text-[1rem] text-[#f9f9f9] transition-all duration-300 placeholder:font-[300] placeholder:text-[#f9f9f9d1] focus:ring-4 focus:ring-[#2A8DC1] focus:outline-none min-[601px]:pl-14 min-[601px]:text-[1.1rem]">
                        <!--require() dynamically loads the file with given url-->
                    <button class="absolute right-0 top-0 flex h-[48px] w-12 cursor-pointer items-center justify-center rounded-r-[16px] bg-transparent p-0" @click.prevent="toogleState">
                        <img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="w-6 min-[601px]:w-7">
                    </button>
                    <p class="mt-1 hidden text-[12px] text-[#9c0606] pl-10 min-[601px]:pl-12" :class="{'!block' : passwordMismatchError}">Passwords do not match!</p>
                </div>

                <div class="mt-3 flex w-full max-w-[396px] flex-col items-start gap-2 text-[14px] min-[601px]:flex-row min-[601px]:items-center min-[601px]:justify-between min-[601px]:text-[16px] [text-shadow:0px_4px_4px_rgba(0,0,0,0.3)]">
                    <label for="accPrivacyPolicy" class="flex cursor-pointer items-center gap-1">
                        <input type="checkbox" name="Accept-Privacy-Policy" id="accPrivacyPolicy" v-model="requiredPrivacy" class="h-4 w-4 cursor-pointer accent-[#0077b6]">
                        Accept <router-link to="/privacy" class="font-medium text-black"> Privacy Policy</router-link><span class="text-[#9c0606] font-bold">*</span>
                    </label>
                    <label for="accTermsofUse" class="flex cursor-pointer items-center gap-1">
                        <input type="checkbox" name="Accept-Terms-of-Use" id="accTermsofUse" v-model="requiredTerms" class="h-4 w-4 cursor-pointer accent-[#0077b6]">
                        Accept <router-link to="/terms" class="font-medium text-black"> Terms of Use</router-link><span class="text-[#9c0606] font-bold">*</span>
                    </label>
                </div>

                <button type="submit" class="mt-[22px] cursor-pointer rounded-md border-2 border-black bg-[#2A8DC1] px-10 py-2 text-[20px] font-medium text-white transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)] min-[601px]:text-[24px] max-[600px]:hover:scale-100 max-[600px]:hover:shadow-none" style="-webkit-tap-highlight-color: transparent;">Register</button>
            </form>

            <p id="sign-in-p" class="mb-4 mt-8 text-center text-[14px] min-[601px]:text-[1.1rem]">
                Already have an account? Sign in <router-link to="/login" id="login-link" class="font-medium text-black">here</router-link>
            </p>
            <router-link to="/" class="font-medium text-black no-underline">Back to Home</router-link>
        </div>
    </main>
</template>

<script setup>
import { account, databases, ID} from '../lib/appwrite'
import { useUserStore } from '@/stores/user';
import { Query } from 'appwrite';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const avatars = ref(false);
const hidPassword = ref(true);
let selectedAvatar = ref(''); //this variable is forwarded to database
const userStore = useUserStore();

const confirmPassword = ref('');
let passwordMismatchError = ref(false); 

//require is used to import other modules - in this case svg images
const avatarsArr = [
    require('../assets/avatars/av1.svg'),
    require('../assets/avatars/av2.svg'),
    require('../assets/avatars/av3.svg'),
    require('../assets/avatars/av4.svg'),
    require('../assets/avatars/av5.svg'),
    require('../assets/avatars/av6.svg'),
    require('../assets/avatars/av7.svg'),
    require('../assets/avatars/av8.svg')
];

const requiredTerms = ref(false);
const requiredPrivacy = ref(false);
const router = useRouter();
let emailError = ref(false); //variable for checking if email is correct
let passwordError = ref(false); //variable for checking if password is correct

//data for databse
const username =  ref('');
const email = ref('');
const password = ref('');
const usernameInput = ref(null);
const emailInput = ref(null);
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_ID;
const collection_user_avatars_id = process.env.VUE_APP_COLLECTION_USER_AVATARS_ID;
const collection_user_stats_id = process.env.VUE_APP_COLLECTION_USER_STATS_ID;

//functions
function chooseAvatar(imgSrc) {
    selectedAvatar.value = imgSrc; //this will be send to database as a name for proper avatar!
    avatars.value = false;
}

function isEmailCorrect() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailError.value = !regex.test(email.value); //test method checks if given string - email, matches the pattern of regex
}

function isPassworValid() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    passwordError.value = !regex.test(password.value);
}

function isPasswordMatch() {
    //password cannot be blank for comparing
    if (password.value && confirmPassword.value) {
        //if passwords are not the same
        passwordMismatchError.value = password.value !== confirmPassword.value;
    } else {
        passwordMismatchError.value = false;
    }
}

async function uniqueEmail(email) {
    try {
        //.listDocuments check all of the documents from given database and collection
        //Query searches for matching email
        const checkEmail = await databases.listDocuments(database_id,collection_id,[Query.equal('email',email)]);
        return checkEmail.total === 0; //unique
    } catch (err) {
        console.log("Error: ", err);
        return false;
    }
}

async function uniqueUsername(username) {
    try {
        const checkUsername = await databases.listDocuments(database_id,collection_id,[Query.equal('username',username)]);
        return checkUsername.total === 0;
    } catch (err) {
        console.log("Error: ", err);
        return false;
    }
}

async function register() {
    try {
        let hasError = false;
        //checking if given username is already in use
        const isUsernameUnique = await uniqueUsername(username.value);
        if(!isUsernameUnique) {
            toast.error("This username is already in use."); 
            if (usernameInput.value) usernameInput.value.value = '';
            return;
        }
        
        //checking if given email is alredy in use
        const isEmailUnique = await uniqueEmail(email.value);
        if(!isEmailUnique) {
            toast.error("This email is already in use.");
            if (emailInput.value) emailInput.value.value = '';
            return;
        }

        if (password.value !== confirmPassword.value) {
            toast.error("The passwords you entered do not match!");
            passwordMismatchError.value = true;
            return;
        }

        isPassworValid(); 
        if (passwordError.value) {
            toast.error("Please ensure your password meets all requirements.");
            hasError = true;
        }
        
        
        //checking if Policy privacy and Terms of use are checked and accepted
        if (!requiredPrivacy.value) {
            toast.error("You must accept the privacy policy.");
            hasError = true;
        }
        
        if (!requiredTerms.value) {
            toast.error("You must accept the terms and conditions.");
            hasError = true;
        }
        
        if (hasError) {
            return;
        }
        
        const newUserId = ID.unique();
        await account.create(newUserId, email.value, password.value, username.value);
        //login user so link can be send
        await account.createEmailPasswordSession(email.value, password.value);
        //sending verification link
        userStore.setVerificationEmail(email.value);
        await account.createVerification(`${window.location.origin}/verify`);

        //checking if user selected an avatar - if not then the deafult one will be send to database
        if (!selectedAvatar.value) {
            selectedAvatar.value = require('../assets/avatars/unk.svg');
        }

        await databases.createDocument(database_id,collection_id,ID.unique(), {
            id_user: newUserId,
            username : username.value,
            email : email.value,
            avatar : selectedAvatar.value
        });

        //storing initial avatar in database
        await databases.createDocument(database_id, collection_user_avatars_id, ID.unique(), {
            user_id: newUserId,
            initial_avatar: selectedAvatar.value,
        });

        //creating document for user stats
        await databases.createDocument(database_id, collection_user_stats_id, ID.unique(), {user_id: newUserId});
        router.push('/check');
    } catch (err) {
        console.log('Error : ', err);
    }
}

function toogleState() {
        hidPassword.value = !hidPassword.value;
}
</script>