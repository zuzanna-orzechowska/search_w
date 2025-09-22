<template>
    <div class="wrapper">
         <div class="dropdown" v-click-outside="() => {dropdownActive = false}">
            <!--v-click-outside directive from https://medium.com/@stjepan.crncic/crafting-a-simple-click-outside-directive-in-vue-3-980c55ab1a65-->
          <span class="material-symbols-outlined" @click="toggleVisibility">account_circle</span>
          <!--is dynamically loads given component if the requirement is met-->
          <component v-if="dropdownActive" :is="DropdownUser" :username="userStore.username" :avatar="userStore.avatar"/>
        </div>
        <div class="content">
            <img src="../assets/logo_text.png" alt="SearchW" id="logo-text">
            <div class="q-wrapper">
              <q>The smart, fun way to test your mind and spot every hidden word.</q>
            </div>
            <div class="btns">
                <button type="button" id="play" @click="goToPlay">Play</button>
                <button type="button" id="challenge" @click="goToChallenge">Challenge</button>
                <button type="button" id="shop" @click="goToShop">Shop</button>
            </div>
        </div>
     </div>
     <AppFooter />
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
import DropdownUser from '@/components/DropdownUser.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { database_id, collection_id, collection_user_stats_id, collection_user_avatars_id, collection_user_achievements_id } from '@/lib/constants';

const router = useRouter();
const userStore = useUserStore();
const dropdownActive = ref(false);

const toggleVisibility = () => {
  dropdownActive.value = !dropdownActive.value;
}

function goToPlay() { router.push('/play'); }
function goToChallenge() { router.push('/challenge'); }
function goToShop() { router.push('/shop'); }

onMounted(async () => {
  localStorage.removeItem('guestProgress');
  await userStore.fetchUser();
  await userStore.fetchUserData(database_id,collection_id,collection_user_stats_id,collection_user_avatars_id,collection_user_achievements_id);
});
</script>

<style lang="scss" scoped>
.wrapper {
    background-image: url(../assets/lines.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
    gap: 20px;

      .dropdown {
        position: absolute;
        top: 20px;
        right: 60px;

        .material-symbols-outlined {
            background-color: #0077b6;
            border-radius: 50%;
            font-size: 64px;
            cursor: pointer;
            margin-top: 36px;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 20px;

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
                background-color: #FFBA08;
            }
            
            #shop {
                background-color: #f9f9f9;
            }
        }
    }
    
}
</style>