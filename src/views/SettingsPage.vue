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
                        <a :href="mailToLink">Click here to send an email.</a>
                    </p>
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
}

.container {
    background-color: rgb(174, 210, 229);
    display: flex;
    align-items: center;
    flex-direction: column;

    .settings-wrapper {
        .setting {
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
        }
    }

    h2{
        font-size: 56px;
        margin-bottom: 4px;
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

    
    .challenge-paused, .before-game {
        //display: none;
        border-radius: 6px;
        width: 540px;
        height: 420px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: rgba(113, 172, 204,0.6);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        gap: 8px;
    }
    
    h2 {
        font-size: 54px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 24px;
    }
    
    .paused-txt, .before-txt {
        display: flex;
        flex-direction: column;
        gap: 16px;

        p{
            font-size: 28px;
            text-align: center;
        }

        .warning {
            font-size: 18px;
            color: rgb(216, 5, 5);
        }
        
        .btns {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 64px;

            .continue-btn {
                background-color: #71ACCC;
            }
            
            button {
                font-size: 24px;
                padding: 1% 12%;
                font-weight: 500;
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
            
            .next-btn, .play-btn {
                background-color: #71ACCC;
            }
        }
    }

    .before-txt {
        p{
            font-size: 20px;
        }

        .btns {
            margin-top: 24px;
        }
    }

    .paused-txt.second {
        margin-top: 32px;
        margin-bottom: 8px;
    }

}

.challenge-completed{
    //display: none;
    background-color: pink;
    border-radius: 6px;
    width: 540px;
    height: 420px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: rgba(113, 172, 204,0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    h2{
        font-size: 54px;
        font-weight: 500;
        text-align: center;
        //width: 300px;
        margin-bottom: 12px;
    }

    .results {
        margin-bottom: 24px;
        text-align: center;

        .stars {
            img {
                width: 80px;
            }
        }

        p {
            font-size: 24px;

            span {
                font-weight: 500;
            }
        }
    }

    .rewards-txt {
        display: flex;
        gap: 64px;
        font-size: 24px;
        margin-bottom: 24px;

        .txt-icon {
            display: flex;
            align-items: center;
            gap: 8px;
            
            img {
                width: 48px;
                position: relative;
                bottom: 8px;
            }
        }

    }

    .btns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 64px;

        button {
        font-size: 24px;
        padding: 1% 12%;
        font-weight: 500;
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

        .again-btn {
            background-color: #71ACCC;
            padding: 1% 14%;
        }
    }

}
</style>