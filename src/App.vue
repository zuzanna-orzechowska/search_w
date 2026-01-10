<template>
  <div id="app">
    <main id="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import '@fontsource-variable/fredoka';
import { onMounted } from 'vue';
import { account } from '@/lib/appwrite';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

onMounted(async () => {
  const isPersistent = localStorage.getItem('rememberMe') === 'true';
  const isTempInThisTab = sessionStorage.getItem('tempSession') === 'true';

  if (!isPersistent && !isTempInThisTab) {
    try {
      const session = await account.getSession('current');
      if (session) {
        await account.deleteSession('current');
        userStore.currentUser = null;
        console.log("Temporary session cleared - security measure.");
      }
    } catch (err) {
      console.log(err);
    }
  }
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
