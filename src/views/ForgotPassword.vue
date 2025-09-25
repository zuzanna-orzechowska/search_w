<template>
    <main>
        <div class="wrapper-login">
            <h2>Forgot Password?</h2>
            <p>Enter your email to receive a password reset link.</p>
            <form @submit.prevent="resetPassword">
                <label for="userEmail">
                    <img src="../assets/user-icon.svg" alt="user icon" class="icon">
                    <input type="email" id="userEmail" name="userEmail" placeholder="E-mail" v-model="userEmail" autocomplete="off" required>
                </label>
                <div class="bottom-form-txt">
                    <router-link to="/login">Back to Login</router-link>
                </div>
                <button type="submit" class="userButton">Send Link</button>
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

<style lang="scss" scoped>
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
        height: 424px;
        border-radius: 6px;
        box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);

        h2 {
            font-size: 64px;
            text-align: center;
            margin: 0px;
            font-weight: 450;
        }
        
        p {
            margin-bottom: 2rem;
            text-align: center;
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

            input[type="email"]:focus, input[type="password"]:focus, input[type="text"]::focus {
                border: 3px solid #2A8DC1;
                outline: none;
            }
            
            .bottom-form-txt {
                margin-top: 12px;
                display: flex;
                width: 364px;
                justify-content: flex-end;
                align-items: center;
                font-size: 16px;
                text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
            }
            
            a {
                background: none;
                border: none;
                color: black;
                font-weight: 500;
                cursor: pointer;
                padding: 0;
                font-size: 0.875rem;
                text-decoration: none;
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
    }
}
</style>