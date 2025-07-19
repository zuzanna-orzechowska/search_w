<template>
  <h1>dupa hehehehehehe</h1>
  <button @click="logout">Logout</button>
</template>

<script setup>
import { account } from '@/lib/appwrite';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = async () => {
    try {
        await account.deleteSession('current');
        console.log('Logged out');
        router.push('/');
    } catch (err) {
        console.error('Logout error:', err);
    }
}; 
</script>

<style>

</style>