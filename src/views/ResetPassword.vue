<template>
    <main>
        <div class="wrapper-login">
            <h2>Reset Password</h2>
            <p>Enter your new password below.</p>
            <form @submit.prevent="updatePassword">
                <label for="newPassword">
                    <div class="password-wrapper">
                        <img src="../assets/password-icon.svg" alt="password icon" class="icon">
                        <input v-if="hidPassword" type="password" id="newPassword" name="newPassword" placeholder="New Password" v-model="newPassword" autocomplete="off" required>
                        <input v-else type="text" id="newPassword" name="newPassword" placeholder="New Password" v-model="newPassword" autocomplete="off" required>
                        <button class="toggleBtn" @click.prevent="toggleState">
                            <img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="eye">
                        </button>
                    </div>
                </label>
                <label for="confirmPassword">
                    <div class="password-wrapper">
                        <img src="../assets/password-icon.svg" alt="password icon" class="icon">
                        <input v-if="hidPassword" type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" v-model="confirmPassword" autocomplete="off" required>
                        <input v-else type="text" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" v-model="confirmPassword" autocomplete="off" required>
                        <button class="toggleBtn" @click.prevent="toggleState">
                            <img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="eye">
                        </button>
                    </div>
                </label>
                <button type="submit" class="userButton">Reset Password</button>
            </form>
            <router-link to="/login">Back to Login</router-link>
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
        height: 524px;
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
            
            .text-button {
                background: none;
                border: none;
                color: #3b82f6;
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

        a {
            background: none;
            border: none;
            color: black;
            font-weight: 500;
            cursor: pointer;
            padding: 0;
            font-size: 0.875rem;
            text-decoration: none;
            padding-top: 24px;
            text-align: center;
            text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
        }
    }

    @media (max-width: 600px) {
        main {
            align-items: flex-start;
            padding: 30px 0;
            min-height: auto; 
        }

        .wrapper-login {
            width: 90%; 
            max-width: 400px;
            height: auto; 
            padding: 30px 20px 40px 20px; 
            box-sizing: border-box;
            box-shadow: 2px 2px 8px 2px rgba(0,0,0,0.2);

            h2 {
                font-size: 40px; 
                margin: 0 0 10px 0; 
            }
            
            p {
                margin-bottom: 0.5em;
                font-size: 14px;
            }

            form {
                width: 100%; 
                gap: 0.8rem;

                .icon{
                    left: 12px;
                    top: 32px;
                    width: 24px;
                }

                input[type="email"], input[type="password"], input[type="text"] {
                    width: 100%;
                    font-size: 1rem;
                    padding: 16px 0 16px 48px;
                }
                
                .password-wrapper {
                    .toggleBtn {
                        width: 50px; 
                        top: 12px;
                        img {
                            width: 26px;
                        }
                    }
                }
                
                .userButton {
                    margin-top: 20px;
                    font-size: 20px;
                    padding: 4px 12px;
                }

                .userButton:hover {
                    box-shadow: none;
                    transform: none;
                }
            }

            a {
                padding-top: 15px;
                font-size: 14px;
            }
        }
    }
}
</style>
