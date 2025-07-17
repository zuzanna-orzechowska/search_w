<template>
  <h1>dupa hehehehehehe</h1>
  <button @click="logout">Logout</button>
</template>

<script setup>
import { account } from '@/lib/appwrite';
const logout = async () => {
    try {
        await account.deleteSession('current');
        console.log('Logged out');
    } catch (err) {
        console.error('Logout error:', err);
    }
}; 
</script>

<style>

</style>