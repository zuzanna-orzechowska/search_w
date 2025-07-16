<template>
    <div class="wrapper">
         <img src="../assets/logo_text.png" alt="SearchW" id="logo-text">
         <div class="q-wrapper">
           <q>The smart, fun way to test your mind and spot every hidden word.</q>
         </div>
         <div class="btns">
             <button type="button" id="sign-in" @click="toLogin">Sign in</button>
             <button type="button" id="random">Random</button>
              <button @click="logout">Logout</button>
         </div>
     </div>
</template>

<script setup>
import { account } from '@/lib/appwrite';
import { useRouter } from 'vue-router';

const router = useRouter();

const toLogin = async () => {
    try {
        const user = await account.get();
        console.log('User exists:', user);
        router.push('/');
    } catch(err) {
        console.log('No session, redirecting to login');
        router.push('/login');
    }
}

const logout = async () => {
    try {
        await account.deleteSession('current');
        console.log('Logged out');
    } catch (err) {
        console.error('Logout error:', err);
    }
}; 

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
  
        #sign-in {
            background-color: #3291C3;
        }
  
        #random {
            background-color: #f9f9f9;
        }
    }
}
</style>