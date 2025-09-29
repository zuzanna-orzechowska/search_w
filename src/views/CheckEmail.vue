<template>
    <div class="wrapper">
        <div class="content">
            <h2>Hello! Please check your email to verify your account.</h2>
            <p>We've sent the verification link to: {{ verificationEmail }}</p>
            <p>If you don't see the email, check your spam folder.</p>
            <img src="../assets/blueFluff.svg" alt="blueFluff">
             <div @click="signOut" class="dropdown-option last">
                <img class="signOutImg" src="../assets/sign-out-icon.svg" alt="Sign out icon">
                <p class="signOutP">Sign out</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { account } from '@/lib/appwrite';
import { useRouter } from 'vue-router';
const userStore = useUserStore();
const verificationEmail = computed(() => userStore.verificationEmail);
const router = useRouter();
async function signOut() {
    try {
         await account.deleteSession('current');
         userStore.$reset(); 
         router.push('/');
     } catch (err) {
         console.error('Logout error:', err);
    }
}
</script>

<style scoped>
.wrapper {
  background-color: rgb(174, 210, 229);
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}
.content {
  text-align: center;
  background-color: #f9f9f9;
  padding: 80px 60px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

h2 {
  font-size: 28px;
  color: #333;
  margin: 0;
  max-width: 400px;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid black;
  padding-bottom: 8px;
  cursor: pointer;
}

.signOutP{
  font-size: 18px;
}            

.signOutImg {
    width: 30px;
}

p {
  font-size: 20px;
}

img {
  width: 150px;
}

@media (max-width: 600px) {
  .content {
    width: 80%;
  }

  h2{
    font-size: 20px;
  }

  p {
    font-size: 18px;
  }
}
</style>