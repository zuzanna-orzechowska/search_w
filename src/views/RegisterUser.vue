<template>
    <main>
        <div class="wrapper-register">
            <h2>Register</h2>
            <!--instead of submiting form and reloading page function register will be called - register user within database-->
            <form @submit.prevent="register">
                <div class="wrapper-avatars">
                    <!--v-bind is a directive that cooperate with JS - change avatar icon depending on a choice - default is "+", any other is user choice
                    v-on (short is @) is a directive that handles DOM events and run handlers when triggered - in this case via click event ;
                    showing/hidding pannel with avatars when clicked-->
                    <img v-bind:src="selectedAvatar || require('../assets/avatar-icon.svg')" v-on:click="avatars = !avatars" alt="plus" class="avatar-icon">

                    <!--v-if is a directive that checks if given condition is met - if yes then the div is visible-->
                    <div v-if="avatars" class="container-avatars">
                        <p>Choose an avatar</p>
                        <div class="images">
                            <!-- v-for is a directive that renders a list - in this case it presents all of avatars from array - the key is their indexes
                             :key attribute is used so Vue can tell the elements apart properly, unique identifying
                             v:bind takes proper img url - the chosen one, v-of uses chooseAvatar method that replace default plus icon with selected image-->
                            <img v-for="(av,ind) in avatarsArr" :key="ind"  v-bind:src="av" v-on:click="chooseAvatar(av)">
                        </div>
                    </div>
                </div>
                <label for="usernameRegister">
                    <img src="../assets/user-icon.svg" alt="user icon" class="icon">
                    <!--v-model is used because it connects value of this input with value of variable in script-->
                    <input type="text" id="usernameRegister" name="Username" placeholder="Username *" v-model="username" required autocomplete="off" ref="usernameInput">
                    <p class="error" :class="{active: username.length > 21}">Username can't be longer than 21 characters!</p>
                </label>
                <label for="emailRegister">
                    <img src="../assets/email-icon.svg" alt="email icon" class="icon">
                    <!--@blur calls given method when input is out of focus-->
                    <input @blur="isEmailCorrect" type="email" id="emailRegister" name="Email" placeholder="E-mail *" v-model="email" required autocomplete="off" ref="emailInput">
                    <p class="error" :class="{active : emailError}">Invalid e-mail address!</p>
                </label>
                <label for="passwordRegister">
                    <div class="password-wrapper">
                        <img src="../assets/password-icon.svg" alt="password-icon" class="icon">
                        <input @blur="isPassworValid" v-if="hidPassword" type="password" id="passwordLogin" name="Password" placeholder="Password" v-model="password" autocomplete="off" required>
                        <input @blur="isPassworValid" v-else type="text" id="passwordLogin" name="Password" placeholder="Password" v-model="password" autocomplete="off" required>
                        <!--require() dynamically loads the file with given url-->
                        <button class="toggleBtn" @click.prevent="toogleState"><img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="eye"></button>
                    </div>
                    <p class="error errPass" :class="{active : passwordError}">Incorrect password! It must be at least 8 characters, with uppercase, lowercase, number and special character.</p>
                </label>
                <div class="bottom-form-txt">
                    <label for="accPrivacyPolicy">
                        <!--this info shouldn't be in database, because it works like that - if user doesn't agree then he can't create an accont-->
                        <input type="checkbox" name="Accept-Privacy-Policy" id="accPrivacyPolicy" v-model="requiredTerms">
                        Accept <router-link to="/privacy"> Privacy Policy</router-link><span>*</span>
                    </label>
                    <label for="accTermsofUse">
                        <input type="checkbox" name="Accept-Terms-of-Use" id="accTermsofUse" v-model="requiredTerms">
                        Accept <router-link to="/terms"> Terms of Use</router-link><span>*</span>
                    </label>
                </div>
                <button type="submit" class="userButton" >Register</button>
            </form>
            <p id="sign-in-p">Already have an account? Sign in <router-link to="/login" id="login-link">here</router-link></p>
        </div>
    </main>
</template>

<script setup>
import { account, databases, ID} from '../lib/appwrite'

import { Query } from 'appwrite';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const avatars = ref(false);
const hidPassword = ref(true);
let selectedAvatar = ref(''); //this variable is forwarded to database

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


        //checking if Policy privacy and Terms of use are checked and accepted
        if (!requiredTerms.value) {
            toast.error("You must accept the terms and conditions.");
            return;
        }

        const newUserId = ID.unique();
        await account.create(newUserId, email.value, password.value, username.value);
        //login user so link can be send
        await account.createEmailPasswordSession(email.value, password.value);
        //sending verification link
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

<style lang="scss">
main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f9f9f9;
    width: 100%;
    
    .wrapper-register {
        width: 40%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(174, 210, 229,0.5);
        height: 680px;
        border-radius: 6px;
        box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);

        h2 {
           font-size: 64px;
            text-align: center;
            margin: 16px 0px;
            font-weight: 450;
        }

        form {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;

            .error {
                display: none;
                position: relative;
                left: 36px;
                top: 4px;
                color: #9c0606;
                font-size: 12px;
            }

            .error.active {
                display: block;
            }

            .error.errPass {
                width: 364px;
            }

            span {
                color: rgb(156, 6, 6);
            }

            .wrapper-avatars {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;

                .avatar-icon {
                    width: 100px;
                    cursor: pointer;
                }

                .container-avatars {
                    width: 700px;
                    background-color: #79AED3;
                    position: absolute;
                    bottom: 116px;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    gap: 24px;
                    padding: 24px 0px;
                    border-radius: 24px;

                    p {
                        font-size: 24px;
                        color: #f9f9f9;
                        font-weight: 300px;
                    }

                    .images {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 24px;

                        img {
                            width: 100px;
                            height: 100px;
                            border-radius: 50%;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        }

                        img:hover {
                            transform: scale(1.1);
                        }
                    }
                }
            }


            .icon {
                position: relative;
                left: 40px;
                top: 6px;
                width: 30px;
            }

            input[type="text"], input[type="password"], input[type="email"] {
                width: 364px;
                font-size: 1.1rem;
                background-color: #6AAED3;
                border: none;
                border-radius: 16px;
                height: 34px;
                padding: 24px 0 24px 48px;
                color: #f9f9f9;
                transition: all 0.3s ease;
            }

            input[type="text"]::placeholder, input[type="password"]::placeholder, input[type="email"]::placeholder {
                color: #f9f9f9d1;
                font-weight: 300px;
            }

            input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus {
                border: 3px solid #2A8DC1;
                outline: none;
            }

            .password-wrapper {
                position: relative;

                input {
                    padding-right: 64px;
                }

                .toggleBtn {
                    position: absolute;
                    right: 0px;
                    top: 0px;
                    background-color: transparent;
                    border: none;
                    border-radius: 0 16px 16px 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 64px;
                    cursor: pointer;

                    img {
                        width: 32px;
                    }
                }
            }

            .bottom-form-txt {
                margin-top: 12px;
                display: flex;
                width: 396px;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
                text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);

                input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }

                label {
                  cursor: pointer;
                }

                input[type="checkbox"]:checked {
                    accent-color: #0077b6;
                }

                label{
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
            }
            
            .userButton {
                margin-top: 22px;
                font-size: 24px;
                padding: 1% 6%;
                color: white;
                font-weight: 500;
                background-color: #2A8DC1;
                border: 2px solid black;
                border-radius: 6px;
                cursor: pointer;
                transform: perspective(1px) translateZ(0);
                box-shadow: 0 0 1px transparent;
                transition-duration: 0.3s;
                transition-property: box-shadow, transform;
            }

            .userButton:hover {
                box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86);
                transform: scale(1.1);
            }
        }

        #sign-in-p {
            text-align: center;
            margin-top: 32px;
            font-size: 1.1rem;
          }

          a {
            color: #000;
            font-weight: 500;
          }
    }

    @media (max-width: 600px) {
        main {
            align-items: flex-start;
            padding: 30px 0;
            min-height: auto; 
        }

        .wrapper-register {
            width: 90%;
            max-width: 400px;
            height: auto;
            padding: 30px 20px 40px 20px;
            box-sizing: border-box;
            box-shadow: 2px 2px 8px 2px rgba(0,0,0,0.2); 

            h2 {
                font-size: 40px; 
                margin: 10px 0 20px 0; 
            }

            form {
                width: 100%;
                gap: 0.6rem;

                .wrapper-avatars {
                    margin-bottom: 10px;

                    .avatar-icon {
                        width: 80px;
                    }

                    .container-avatars {
                        width: 95vw;
                        max-width: 350px;
                        bottom: 164px;
                        padding: 15px 10px;
                        gap: 15px;

                        p {
                            font-size: 18px;
                        }

                        .images {
                            grid-template-columns: repeat(3, 1fr);
                            gap: 12px;

                            img {
                                width: 70px;
                                height: 70px;
                            }
                            img:hover {
                                transform: none; 
                            }
                        }
                    }
                }
                
                .icon {
                    left: 12px;
                    top: 32px; 
                    width: 24px;
                }
                
                input[type="text"], input[type="password"], input[type="email"] {
                    width: 100%;
                    font-size: 1rem;
                    padding: 16px 0 16px 48px;
                }
                
                .error {
                    left: 20px;
                }
                .error.errPass {
                    width: 100%;
                    padding-right: 10px;
                    box-sizing: border-box;
                }
                
                .password-wrapper {
                    .toggleBtn {
                        top: 12px;
                        width: 50px; 
                        img {
                            width: 26px;
                        }
                    }
                }

                .bottom-form-txt {
                    width: 100%;
                    align-items: flex-start;
                    gap: 8px;
                    font-size: 14px;
                    margin-top: 10px;
                }
                
                .userButton {
                    margin-top: 15px;
                    font-size: 20px;
                    padding: 4px 12px;
                }

                .userButton:hover {
                    box-shadow: none;
                    transform: none;
                }
            }

            #sign-in-p {
                margin-top: 25px;
                font-size: 14px;
            }
        }
    }
}
</style>