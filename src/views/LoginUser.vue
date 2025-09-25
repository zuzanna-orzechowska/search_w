<template>
    <main>
        <div class="wrapper-login">
            <h2>Login</h2>
            <form @submit.prevent="login">
                <label for="userLogin">
                    <img src="../assets/user-icon.svg" alt="user icon" class="icon">
                    <input type="email" id="userLogin" name="userLogin" placeholder="E-mail" v-model="userLogin" autocomplete="off" required>
                </label>
                <label for="passwordLogin">
                    <div class="password-wrapper">
                        <img src="../assets/password-icon.svg" alt="password-icon" class="icon">
                        <input v-if="hidPassword" type="password" id="passwordLogin" name="Password" placeholder="Password" v-model="password" autocomplete="off" required>
                        <input v-else type="text" id="passwordLogin" name="Password" placeholder="Password" v-model="password" autocomplete="off" required>
                        <!--require() dynamically loads the file with given url-->
                        <button class="toggleBtn" @click.prevent="toggleState"><img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="eye"></button>
                    </div>
                </label>
                <div class="bottom-form-txt">
                    <label for="rememberLogin">
                        <input type="checkbox" name="Remember-me" id="rememberLogin" v-model="rememberMe">
                        Remember me
                    </label>
                    <label @click.prevent="router.push('/forgot')">Forgot password?</label>
                </div>
                <button type="submit" class="userButton">Login</button>
            </form>
            <p>Don't have an account? Sign up <router-link to="/register" id="register-link">here</router-link></p>
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

<style lang="scss">
main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f9f9f9;
    width: 100%;
    
    .wrapper-login {
        width: 40%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(174, 210, 229,0.5);
        height: 524px;
        border-radius: 6px;
        box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);

        h2 {
            font-size: 64px;
            text-align: center;
            margin: 32px 0px;
            font-weight: 450;
        }

        form {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;

            .icon{
                position: relative;
                left: 40px;
                top: 6px;
                width: 30px;
            }

            input[type="email"], input[type="password"], input[type="text"] {
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

            input[type="email"]::placeholder, input[type="password"]::placeholder, input[type="text"]::placeholder {
                color: #f9f9f9d1;
                font-weight: 300px;
            }

            input[type="email"]:focus, input[type="password"]:focus, input[type="text"]:focus {
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
                width: 364px;
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
                font-weight: 500;
                color: white;
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

        p {
            text-align: center;
            margin-top: 32px;

          }

          a {
            color: #000;
            font-weight: 500;
          }

          .otherRegister {
           p {
            text-align: center;
            overflow: hidden;
           }

           p:before, p:after {
            background-color: #000;
            content: "";
            display: inline-block;
            height: 2px;
            position: relative;
            vertical-align: middle;
            width: 20%;
           }

           p:before {
            right: 0.5em;
            margin-left: -50%;
        }

            p:after {
            left: 0.5em;
            margin-right: -50%;
        }

            .linksRegister {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 36px;
                margin-top: 24px;

                img {
                    width: 40px;
                    cursor: pointer;
                }
            }
        }
    }
}

@media (min-width: 990px) {

}

@media (min-width: 760px) {

}

@media (min-width: 570px) {

}
</style>