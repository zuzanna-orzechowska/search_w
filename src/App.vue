<template>
  <div id="app">
    <main id="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import '@fontsource-variable/fredoka';
import { account } from './lib/appwrite';
import {onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

//variables
const route = useRoute();
const router = useRouter();

async function checkSessionStatus() {
    try {
      const user = await account.get(); // checking session status - if user is already logged in 
      console.log({ user })

      // if user is on main page or after successful login then redirect to component for users
      if (route.path === '/' || route.path === '/login') {
        router.push('/user');
      }
    } catch (err) {
      console.log("Error: ",err);
      router.push('/');
    }
}

onMounted(() => { //lifecycle hook that calls given function after the component shows up on a screen
  checkSessionStatus();
});
</script>


<style lang="scss">
 *{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Fredoka Variable', sans-serif;

  body {
    #app {
      min-height: 100vh;
    }
  }
 }
</style>
