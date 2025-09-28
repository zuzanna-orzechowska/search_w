<template>
  <div id="app">
    <main id="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import '@fontsource-variable/fredoka';
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
