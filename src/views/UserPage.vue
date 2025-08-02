<template>
    <div class="wrapper">
         <img src="../assets/logo_text.png" alt="SearchW" id="logo-text">
         <div class="q-wrapper">
           <q>The smart, fun way to test your mind and spot every hidden word.</q>
         </div>
         <div class="btns">
             <button type="button" id="play" @click="goToPlay">Play</button>
             <button type="button" id="challenge" @click="goToChallenge">Challenge</button>
             <button type="button" id="shop">Shop</button>
         </div>
     </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToPlay () {
    router.push('/play');
}

function goToChallenge() {
    router.push('/challenge');
}
</script>

<style lang="scss">
.wrapper {
    #logo-text {
        width: 420px;
        margin-left: 52px;
    }
  
    .q-wrapper {
        width: 408px;
        text-align: center;
        margin-left: 52px;

        q {
            font-size: 20px;
        }
    }
  
    .btns {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 20px;
        margin-top: 24px;
        margin-left: 52px;

        button{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            padding: 1% 6%;
            border: 2px black solid;
            border-radius: 6px;
            font-weight: 500;
            width: 148px;
            cursor: pointer;
            transform: perspective(1px) translateZ(0);
            box-shadow: 0 0 1px transparent;
            transition-duration: 0.3s;
            transition-property: box-shadow, transform;
        }

        button:hover {
            box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86);
            transform: scale(1.1);
        }
  
        #play {
            background-color: #3291C3;
        }
  
        #challenge {
            background-color: #f9f9f9;
        }

        #shop {
            background-color: #FFBA08;
        }
    }
}
</style>