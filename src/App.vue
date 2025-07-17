<template>
  <v-app :class="{ 'background-enabled': !backgroundDisabled }" id="app">
    <AppHeader v-if="!backgroundDisabled" />
    <v-main id="main">
      <router-view />
    </v-main>
    <AppFooter v-if="!backgroundDisabled"/>
  </v-app>
</template>

<script>
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import '@fontsource-variable/fredoka';
import { account } from './lib/appwrite';

import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  components: {
    AppFooter,
    AppHeader,
  },

  setup() {
    const route = useRoute();
    const backgroundDisabled = computed(() => route.path === '/login' || route.path === '/register');
    return { backgroundDisabled}
  },

  async mounted() { //mounted is lifecycle hook and it will executed before creating the component.
    try {
      await account.get(); // checking session status - if user is already logged in

      // if user is on main page or after successful login then redirect to component for users
      if (this.$route.path === '/' || this.$route.path === '/login') {
        this.$router.push('/user');
      }
    } catch (err) { //if user is not logged in CHECK?
      console.log("Error: ",err);
    }

    window.addEventListener('beforeunload',async () => { // event is fired when the current window, contained document, and associated resources are about to be unloaded.
      const rememberUser = localStorage.getItem("rememberMe");
      if(!rememberUser) {
        try {
          await account.deleteSession('current');
        } catch (err) {
          console.log("Error: ",err);
        }
      }
    })
  }
}
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
