<template>
  <div class="right-up-wrapper">
    <div class="coins-display">
      <img src="@/assets/coin-icon.svg" alt="Coins">
      <p>{{ userCoins }}</p>
    </div>
    <div class="coins-deducted" v-if="showCoinsDeducted">
      <p>-{{ hintCost }}</p>
      <img src="@/assets/coin-icon.svg" alt="Coin deducted">
    </div>
    <div class="avatar-wrapper">
      <div class="dropdown" v-click-outside="closeDropdown">
        <img @click="$emit('toggleDropdown')" :src="userAvatar" alt="User Avatar" class="user-avatar" />
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

<style lang="scss" scoped>
.right-up-wrapper {
  position: absolute; top: 20px; right: 20px; display: flex; align-items: center; gap: 16px;
  .coins-display { 
    display: flex; align-items: center; gap: 8px;
    p { font-size: 24px; margin-top: 24px; }
    img { width: 42px; height: 42px; }
  }
  .coins-deducted {
    display: flex; align-items: center; gap: 8px; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); opacity: 0; animation: deduct-animation 2s forwards;
    p { font-size: 24px; font-weight: 500; color: #e74c3c; margin: 0; }
    img { width: 42px; height: 42px; }
  }
  .user-avatar { width: 60px; height: 60px; border-radius: 50%; cursor: pointer; }
}

@keyframes deduct-animation {
  0% { transform: translate(-50%, -50%); opacity: 1; }
  100% { transform: translate(-50%, -150%); opacity: 0; }
}

@media (max-width: 600px) {
  .right-up-wrapper {
    top: 10px; right: 10px; gap: 8px;
    .coins-display { p { font-size: 18px; } img { width: 30px; height: 30px; } }
    .user-avatar { width: 40px; height: 40px; }
  }
}
</style>