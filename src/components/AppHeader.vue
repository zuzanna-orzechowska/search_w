<!--toggle from https://www.w3schools.com/howto/howto_css_switch.asp -->
<template>
    <header class="header">
        <label class="switch">
          <input type="checkbox">
          <span class="slider"></span>
        </label>
        <div class="dropdown">
          <span class="material-symbols-outlined" @click="toggleVisibility">account_circle</span>
          <!--is dynamically loads given component if the requirement is met-->
          <component v-if="dropdownActive" :is="loggedIn ? DropdownUser : DropdownGuest"/>
        </div>
    </header>
</template>

<script setup>
import DropdownGuest from './DropdownGuest.vue';
import DropdownUser from './DropdownUser.vue';
import { ref, onMounted } from 'vue';
import { account } from '@/lib/appwrite';

const dropdownActive = ref(false);
let loggedIn = ref(false);

const toggleVisibility = () => {
  dropdownActive.value = !dropdownActive.value;
}

//checking before loading component if user is logged in 
async function checkSessionStatus() {
    try {
      await account.get(); // checking session status - if user is already logged in 
      loggedIn.value = true;
    } catch (err) {
      console.log("Error: ",err);
    }
}

onMounted(() => { //lifecycle hook that calls given function after the component shows up on a screen
  checkSessionStatus();
});
</script>

<style lang="scss">
.header {
  /*top: 0;
  position: static; */
  display: flex;
  justify-content: flex-end;
  gap: 2%;
  margin: 12px 36px;
  align-items: center;

  .switch {
    position: relative;
    display: inline-block;
    width: 54px;
    height: 32px;
    margin-top: 36px;

    input { 
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #0077b6;
      -webkit-transition: .4s;
      transition: .4s;
      border-radius: 34px
    }
    
    .slider:before {
      position: absolute;
      content: "";
      height: 24px;
      width: 24px;
      left: 4px;
      bottom: 4px;
      background-color: #000;
      -webkit-transition: .4s;
      transition: .4s;
      border-radius: 50%;
    }
    
    input:checked + .slider {
      background-color: #000;
    }
    
    input:focus + .slider {
      box-shadow: 0 0 1px #0077b6;
    }
    
    input:checked + .slider:before {
      -webkit-transform: translateX(20px);
      -ms-transform: translateX(20px);
      transform: translateX(20px);
      background-color: #0077b6;
    }
  }

  .dropdown {
    position: relative;
    display: inline-block;

    .material-symbols-outlined {
      background-color: #0077b6;
      border-radius: 50%;
      font-size: 54px;
      cursor: pointer;
      margin-top: 36px;
    }
  }
}
</style>