<template>
  <v-app :class="{ 'background-enabled': !registerActive }" id="app">
    <AppHeader v-if="!registerActive" />
    <v-main id="main">
      <router-view />
    </v-main>
    <AppFooter v-if="!registerActive"/>
  </v-app>
</template>

<script>
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import '@fontsource-variable/fredoka';

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
    const registerActive = computed(() => route.path === '/login');
    return { registerActive}
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
