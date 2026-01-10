<template>
    <div class="flex min-h-screen w-full flex-col items-center justify-center bg-[#aed2e5] p-5 text-center">
        <h2 class="m-0 text-[6rem] font-bold text-[#0077b6] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]" style="-webkit-text-stroke: black 1px;">
            404
        </h2>
        <h1 class="mb-2 text-[2.5rem] font-bold">Page not found.</h1>
        <p class="my-4 mb-8 max-w-[600px] text-[1.2rem]">The page you are looking for doesn't exist or has been moved</p>
        <button @click="goBack" class="cursor-pointer rounded-md border-2 border-black bg-[#f9f9f9] px-[2%] py-[1%] text-[24px] font-medium transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)]">
            Back
        </button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goBack = () => {
    router.back();
}
</script>