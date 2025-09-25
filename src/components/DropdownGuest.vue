<template>
    <div class="dropdown-content">
        <div class="dropdown-section">
            <p>Come back to word searching’s journey</p>
            <button class="dropdown-btn" @click="toLogin">Sign in</button>
        </div>
        <div class="dropdown-section">
            <p>Don’t have an account?</p>
            <button class="dropdown-btn white" @click="toRegister">Sign up</button>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const toLogin = () => {
  router.push('/login');
}

const toRegister = async () => {
  router.push('/register');
}
</script>

<style lang="scss" scoped>
.dropdown-content {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 42px;
      position: absolute;
      width: 300px;
      height: 304px;
      z-index: 1;
      right: 20px;
      margin-top: 8px;
      border-radius: 6px;
      background-color: rgba(174, 210, 229,0.5);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);

      .dropdown-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        p { 
          text-align: center;
          width: 224px;
          font-size: 20px;
        }
  
        .dropdown-btn {
          font-size: 18px;
          padding: 1% 6%;
          font-weight: 500;
          width: 100px;
          background-color: #2A8DC1;
          border: 2px solid black;
          border-radius: 6px;
          cursor: pointer;
          transform: perspective(1px) translateZ(0);
          box-shadow: 0 0 1px transparent;
          transition-duration: 0.3s;
          transition-property: box-shadow, transform;
        }

        .dropdown-btn:hover {
          box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86);
          transform: scale(1.1);
        }

        .white {
          background-color: #f9f9f9;
        }
      }
}
</style>