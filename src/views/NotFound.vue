<template>
    <div class="container">
        <h2>404</h2>
        <h1>Page not found.</h1>
        <p>The page you are looking for doesn't exist or has been moved</p>
        <button @click="goBack">Back</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goBack = () => {
    router.back();
}
</script>

<style lang="scss" scoped>
$background-color: #aed2e5;
$accent-color: #0077b6;

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    background-color: $background-color;
    padding: 20px;
    width: 100%;
}

h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

h2 {
    font-size: 6rem;
    font-weight: 700;
    margin: 0;
    color: $accent-color;
    -webkit-text-stroke: black 1px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

p {
    font-size: 1.2rem;
    margin: 1rem 0 2rem;
    max-width: 600px;
}

button {
    font-size: 24px;
    padding: 1% 2%;
    font-weight: 500;
    background-color: #f9f9f9;
    border: 2px solid black;
    border-radius: 6px;
    cursor: pointer;
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px transparent;
    transition-duration: 0.3s;
    transition-property: box-shadow, transform;

    &:hover {
        box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86);
        transform: scale(1.1);
    }
}
</style>