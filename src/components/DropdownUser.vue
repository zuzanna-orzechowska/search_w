<template>
    <div class="dropdown-content long">
        <div class="dropdown-section">
            <p>Welcome {{userStore.username}}</p>
            <img :src="userStore.avatar" alt="User avatar">
        </div>
        <div class="dropdown-section-left">
            <div class="dropdown-option" @click="router.push('/profile')">
                <img src="../assets/profile-icon.svg" alt="Profile icon">
                <p>Profile</p>
            </div>
            <div class="dropdown-option" @click="router.push('/achievements')">
                <img src="../assets/achievements-icon.svg" alt="Achievements icon">
                <p>Achievements</p>
            </div>
            <div class="dropdown-option" @click="router.push('/settings')">
                <img src="../assets/settings-icon.svg" alt="Settings icon">
                <p>Settings</p>
            </div>
            <div class="dropdown-option" @click="router.push('/help')">
                <img src="../assets/help-icon.svg" alt="Help icon">
                <p>Help</p>
            </div>
            <div @click="signOut" class="dropdown-option last">
                <img src="../assets/sign-out-icon.svg" alt="Sign out icon">
                <p>Sign out</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { account } from '@/lib/appwrite';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

//functions
async function signOut() {
    try {
         await account.deleteSession('current');
         router.push('/');
     } catch (err) {
         console.error('Logout error:', err);
    }
}
</script>

<style lang="scss" scoped>
.long {
    height: 420px;
}

.dropdown-content {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      height: 444px;
      position: absolute;
      width: 300px;
      z-index: 1;
      right: 20px;
      margin-top: 8px;
      border-radius: 6px;
      background-color: rgba(174, 210, 229,0.5);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);

      .dropdown-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        
        p { 
          text-align: center;
          width: 224px;
          font-size: 20px;
        }

        img {
            width: 80px;
            padding: 8px 0px;
            border-radius: 50%;
        }

      }

    .dropdown-section-left {
        width: 254px;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .dropdown-option {
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid black;
            padding-bottom: 8px;
            cursor: pointer;

            img {
                width: 30px;
            }

            p{
                font-size: 18px;
            }            
        }

        .dropdown-option.last {
            border-bottom: none;
        }
    }
}
</style>