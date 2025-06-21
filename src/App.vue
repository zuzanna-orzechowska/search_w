<template>
  <v-app id="app">
    <AppHeader />
    <v-main id="main">
      <router-view>
        <div class="wrapper">
          <img src="./assets/logo_text.png" alt="SearchW" id="logo-text">
          <div class="q-wrapper">
            <q>The smart, fun way to test your mind and spot every hidden word.</q>
          </div>
          <div class="btns">
            <button type="button" id="sign-in">Sign in</button>
            <button type="button" id="random">Random</button>
          </div>
        </div>
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
      background-image: url(./assets/lines.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      
      #main {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .wrapper {
          margin-top: 24px;
          #logo-text {
            width: 420px;
            margin-left: 52px;
          }
  
          .q-wrapper {
            width: 408px;
            text-align: center;
            margin-left: 52px;
            q {
              font-size: 20px;
            }
          }
  
          .btns {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 20px;
            margin-top: 24px;
            margin-left: 52px;
  
            button{
              font-size: 24px;
              padding: 1% 6%;
              border: 2px black solid;
              border-radius: 6px;
              font-weight: 500;
            }
  
            #sign-in {
              background-color: #3291C3;
            }
  
            #random {
              background-color: #f9f9f9;
            }
          }
        }

      }
    }
  }
 }
</style>
