<template>
  <div class="wrapper">
    <h2>Logging in...</h2>
  </div>
</template>

<script setup>
import { account } from '@/lib/appwrite';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    const userId = route.query.userId;
    const secret = route.query.secret;

    if (!userId || !secret) {
        return;
    }

    try {
        await account.updateVerification(userId, secret);
        router.push('/login'); 
    } catch (err) {
        console.error("Verification failed:", err);
    }
});
</script>

<style scoped>
.wrapper {
  background-color: rgb(174, 210, 229);
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}

@media (max-width: 600px) {
  h2 {
    font-size: 54px;
  }
}
</style>