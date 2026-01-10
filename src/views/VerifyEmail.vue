<template>
  <div class="grid h-screen w-screen place-items-center bg-[#aed2e5]">
    <h2 class="text-[54px] font-bold text-[#333]">Logging in...</h2>
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