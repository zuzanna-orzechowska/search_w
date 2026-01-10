<template>
    <div class="fixed bottom-0 left-0 flex h-20 w-full items-center justify-center bg-[#AED2E5]">
        <button @click="goBack"
            class="cursor-pointer rounded-md border-2 border-black bg-[#f9f9f9] px-[2%] py-[1%] text-[24px] font-medium text-black transition-all duration-300 hover:scale-110 hover:shadow-[0px_8px_30px_-4px_rgba(8,73,111,0.86)]"
            style="-webkit-tap-highlight-color: transparent;">
            Back
        </button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goBack() {
    router.back();
}
</script>