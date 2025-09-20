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

<style>

</style>