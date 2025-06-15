<template>
  <v-app id="app">
    <AppHeader />
    <v-main id="main">
      <router-view>
        <img src="./assets/logo_text.png" alt="SearchW">
      </router-view>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import '@fontsource-variable/fredoka';

export default {
  name: 'App',
  components: {
    AppFooter,
    AppHeader
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

    #app {
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr auto;
      background-image: url(./assets/background_drawing.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 85%;
      
      #main {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 140%;
          margin-bottom: 32%;
        }
      }
    }
  }
 }
</style>
