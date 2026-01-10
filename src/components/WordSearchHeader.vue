<template>
  <div class="absolute top-[10px] right-[10px] flex items-center gap-2 min-[601px]:top-5 min-[601px]:right-5 min-[601px]:gap-4">
    <div class="flex items-center gap-2">
      <img src="@/assets/coin-icon.svg" alt="Coins" class="h-[30px] w-[30px] min-[601px]:h-[42px] min-[601px]:w-[42px]">
      <p class="mt-0 text-[18px] min-[601px]:mt-6 min-[601px]:text-[24px]">{{ userCoins }}</p>
    </div>

    <div v-if="showCoinsDeducted" class="animate-deduct absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 opacity-0">
      <p class="m-0 text-[24px] font-medium text-[#e74c3c]">-{{ hintCost }}</p>
      <img src="@/assets/coin-icon.svg" alt="Coin deducted" class="h-[42px] w-[42px]">
    </div>

    <div class="avatar-wrapper">
      <div class="relative" v-click-outside="closeDropdown">
        <img 
          @click="$emit('toggleDropdown')" 
          :src="userAvatar" 
          alt="User Avatar" 
          class="h-10 w-10 cursor-pointer rounded-full min-[601px]:h-[60px] min-[601px]:w-[60px]" 
        />
        <component v-if="dropdownActive" :is="DropdownUser" />
      </div>
    </div>
  </div>
</template>

<script setup>
import DropdownUser from '@/components/DropdownUser.vue';
import { defineProps, defineEmits } from 'vue';

defineProps(['userCoins', 'userAvatar', 'showCoinsDeducted', 'hintCost', 'dropdownActive']);
const emit = defineEmits(['toggleDropdown', 'closeDropdown']);

const closeDropdown = () => emit('closeDropdown');
</script>

<style>
@keyframes deduct-animation {
  0% { transform: translate(-50%, -50%); opacity: 1; }
  100% { transform: translate(-50%, -150%); opacity: 0; }
}
.animate-deduct {
  animation: deduct-animation 2s forwards;
}
</style>