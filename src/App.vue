<template>
  <v-app id="app">
    <AppHeader />
    <v-main id="main">
      <router-view>
        <h2>Hello</h2>
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
      grid-template-rows: 1fr auto;
      
      #main {
        background-color: pink;
      }
    }
  }
 }
</style>
