<template>
  <v-app :class="{ 'background-enabled': !backgroundDisabled }" id="app">
    <AppHeader v-if="!backgroundDisabled" />
    <v-main id="main">
      <router-view />
    </v-main>
    <AppFooter v-if="!backgroundDisabled"/>
  </v-app>
</template>

<script setup>
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import '@fontsource-variable/fredoka';
import { account } from './lib/appwrite';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

//variables
const route = useRoute();
const router = useRouter();
const backgroundDisabled = computed(() => route.path === '/login' || route.path === '/register');

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
    background-color: #f9f9f9;

    .background-enabled {
      background-image: url(./assets/lines.png);
      background-repeat: no-repeat;
      background-position: top;
      background-size: contain; 
    }

    #app {
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr auto;
      #main {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
    }
  }
 }
</style>
