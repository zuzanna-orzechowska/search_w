<template>
    <div class="background-container">
        <div class="container">
            <h2>Settings</h2>
            <div class="settings-wrapper">
                <div class="setting">
                    <h1>Change password</h1>
                    <p>Set a unique password to protect your account.</p>

                    <form v-if="isEditingPassword" @submit.prevent="changePassword" class="edit-form">
                        <div class="password-wrapper">
                            <img src="../assets/password-icon.svg" alt="password-icon" class="icon">
                            <input v-if="hidPassword" type="password" id="oldPassword" name="oldPassword" placeholder="Old Password" v-model="oldPassword" autocomplete="off" required>
                            <input v-else type="text" id="oldPassword" name="oldPassword" placeholder="Old Password" v-model="oldPassword" autocomplete="off" required>
                            <button class="toggleBtn" @click.prevent="toggleState"><img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="eye"></button>
                        </div>
                        <div class="password-wrapper">
                            <img src="../assets/password-icon.svg" alt="password-icon" class="icon">
                            <input v-if="hidPassword" type="password" id="newPassword" name="newPassword" placeholder="New Password" v-model="newPassword" autocomplete="off" required>
                            <input v-else type="text" id="newPassword" name="newPassword" placeholder="New Password" v-model="newPassword" autocomplete="off" required>
                            <button class="toggleBtn" @click.prevent="toggleState"><img :src="hidPassword ? require('@/assets/eye-cross-icon.svg') : require('@/assets/eye-icon.svg')" alt="eye password icon" class="eye"></button>
                        </div>
                        <button type="submit">Confirm</button>
                    </form>
                    
                    <button v-else @click="isEditingPassword = true">Change</button>
                </div>
                <div class="setting">
                    <h1>Delete account</h1>
                    <p>Your account will be permanently deleted from SearchW.</p>
                    <p>If you wish to delete your account, please inform the administrator.
                    </p>
                    <a :href="mailToLink">Click here to send an email.</a>
                </div>
            </div>

            <div class="bottom">
                <img @click="goBack" src="../assets/home-icon.svg" alt="home icon">
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

<style lang="scss" scoped>
.background-container {
    background-color: rgb(174, 210, 229);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    background-color: rgb(174, 210, 229);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    flex-direction: column;

    .settings-wrapper {
        display: flex;
        flex-direction: column;
        gap: 32px;

        .setting {
            display: flex;
            flex-direction: column;
            gap: 4px;

            a {
                text-decoration: none;
                color: black;
                font-weight: bold;
                width: 200px;
            }

            h1 {
                font-weight: 500;
            }

            form {
                .icon {
                    position: relative;
                    left: 40px;
                    top: 6px;
                    width: 30px;
                }
    
                input[type="text"], input[type="password"]{
                    width: 364px;
                    font-size: 18px;
                    background-color: #6AAED3;
                    border: none;
                    border-radius: 16px;
                    height: 34px;
                    padding: 24px 0 24px 48px;
                    color: #f9f9f9;
                    transition: all 0.3s ease;
                }
    
                input[type="text"]::placeholder, input[type="password"]::placeholder {
                    color: #f9f9f9d1;
                    font-weight: 300px;
                }
    
                input[type="text"]:focus, input[type="password"]:focus{
                    border: 3px solid #2A8DC1;
                    outline: none;
                }
    
                .password-wrapper {
                    position: relative;
                    margin-top: 24px;
    
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

            }
            button {
                font-size: 16px;
                width: 80px;
                padding: 2px 4px;
                font-weight: 500;
                margin-top: 12px;
                background-color: #f9f9f9;
                border: 2px solid black;
                border-radius: 6px;
                cursor: pointer;
                transform: perspective(1px) translateZ(0);
                box-shadow: 0 0 1px transparent;
                transition-duration: 0.3s;
                transition-property: box-shadow, transform;
            }

            button:hover {
                box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86);
                transform: scale(1.1);
            }
        }
    }

    h2{
        font-size: 56px;
        font-weight: 500;
        margin-bottom: 16px;
        margin-top: 12px;
    }


    .bottom{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 32px;
        background-color: #57A4CD;
        width: 280px;
        height: auto;
        border: 4px solid black;
        border-radius: 24px;
        gap: 24px;

        img{
            width: 44px;
            cursor: pointer;
            margin-top: 0;
        }
    }
}
</style>