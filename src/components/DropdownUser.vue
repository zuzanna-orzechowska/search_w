<template>
    <div class="dropdown-content long">
        <div class="dropdown-section">
            <p>Welcome {{username}}</p>
            <img :src="avatar" alt="User avatar">
        </div>
        <div class="dropdown-section-left">
            <div class="dropdown-option" @click="goToProfile">
                <img src="../assets/profile-icon.svg" alt="Profile icon">
                <p >Profile</p>
            </div>
            <div class="dropdown-option">
                <img src="../assets/achievements-icon.svg" alt="Achievements icon">
                <router-link to="/achievements">Achievements</router-link>
            </div>
            <div class="dropdown-option">
                <img src="../assets/settings-icon.svg" alt="Settings icon">
                <router-link to="/settings">Settings</router-link>
            </div>
            <div class="dropdown-option">
                <img src="../assets/help-icon.svg" alt="Help icon">
                <router-link to="/help">Help</router-link>
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
import { defineProps } from 'vue';

const router = useRouter();

//props
defineProps({
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  }
});

//functions
async function signOut() {
    try {
         await account.deleteSession('current');
         console.log('Logged out');
         router.push('/');
     } catch (err) {
         console.error('Logout error:', err);
    }
}

function goToProfile() {
    router.push('/profile');
}
</script>

<style lang="scss">
.long {
    height: 420px;
}

.dropdown-content {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 12px;

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

            p,a {
                font-size: 18px;
            }

            a{
                text-decoration: none;
                color: black;
            }
            
        }

        .dropdown-option.last {
            border-bottom: none;
        }
    }
}
</style>