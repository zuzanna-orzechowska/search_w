<template>
    <div class="wrapper">
        <div class="dropdown" v-click-outside="() => {dropdownActive = false}">
            <!--v-click-outside directive from https://medium.com/@stjepan.crncic/crafting-a-simple-click-outside-directive-in-vue-3-980c55ab1a65-->
          <span class="material-symbols-outlined" @click="toggleVisibility">account_circle</span>
          <!--is dynamically loads given component if the requirement is met-->
          <component v-if="dropdownActive" :is="DropdownGuest"/>
        </div>
        <div class="content">
            <img src="../assets/logo_text.png" alt="SearchW" id="logo-text">
            <div class="q-wrapper">
              <q>The smart, fun way to test your mind and spot every hidden word.</q>
            </div>
            <div class="btns">
                <button type="button" id="sign-in" @click="toLogin">Sign in</button>
                <button type="button" id="random" @click="randomCategory">Random</button>
            </div>
        </div>
        <AppFooter />
    </div>
     
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
import DropdownGuest from '@/components/DropdownGuest.vue';
import { useRouter } from 'vue-router';
import categories from '@/lib/categoriesPlay';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const router = useRouter();
const completedCategories = ref(0);
const dropdownActive = ref(false);

const toggleVisibility = () => {
  dropdownActive.value = !dropdownActive.value;
}

const toLogin = () => {
    router.push('/login');
}

function randomCategory() {
    if (completedCategories.value === 1) {
        toast.error("You've completed random puzzle. Please sign in to save your progress and unlock more!");
        return;
    }
    const ind = Math.floor(Math.random() * categories.length);
    const randomCategory = categories[ind];
    router.push({path: '/random', query: {category: randomCategory.name}})
}

onMounted(() => {
    const savedProgress = localStorage.getItem('guestProgress');
    if (savedProgress) {
        completedCategories.value = parseInt(savedProgress);
    }
});

</script>

<style lang="scss" scoped>
.wrapper {
    background-image: url(../assets/lines.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    min-height: 100dvh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
 

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
        gap: 12px;

        #logo-text {
            width: 444px;
            margin-left: 52px;
        }
      
        .q-wrapper {
            width: 408px;
            text-align: center;
            margin-left: 52px;
    
            q {
                font-size: 18px;
                font-style: italic;
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
                -webkit-tap-highlight-color: transparent;
                -webkit-text-fill-color: initial;
                color: black !important;
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

    @media (max-width: 600px) {
            padding: 10px;
    
            .dropdown {
                right: 20px;
                top: 10px;
    
                .material-symbols-outlined {
                    font-size: 64px;
                    margin-top: 10px;
                }
            }
    
            .content {
                gap: 8px;
    
                #logo-text {
                    width: 96vw;
                    max-width: 372px;
                    margin-left: 0;
                }
              
                .q-wrapper {
                    width: 90vw;
                    margin-left: 0;
            
                    q {
                        font-size: 20px;
                    }
                }
              
                .btns {
                    margin-top: 20px;
                    margin-left: 0;
                    gap: 16px;
    
                    button{
                        font-size: 20px;
                        padding: 4px 0;
                        width: 110px; 
                    }
    
                    button:hover {
                        box-shadow: none;
                        transform: none;
                    }
                }
            }
    }
}

</style>