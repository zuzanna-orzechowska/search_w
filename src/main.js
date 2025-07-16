import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
//import { account } from './lib/appwrite'

import App from './App.vue'
import LoginUser from './components/LoginUser.vue'
import HomePage from './components/HomePage.vue'
import RegisterUser from './components/RegisterUser.vue'

const router = createRouter ({
    history: createWebHistory(),
    routes: [
        {path: '/', component: HomePage},
        {path: '/login', component: LoginUser},
        {path: '/register', component: RegisterUser}
    ]
});

//checking authentications, beforeEach executes given function before each navigation - in this case, if user is already logged in and try to manually go to /register
// or /login alert (vue-toastify) will be shown
//to - path that user is in, from - path that user will be redirected to, next - next navigation can be done
// router.beforeEach( async (to,from, next) => {
//     const manRoutes = ['/login','/register'];
//     let isCurrSession = false;

//     try {
//         await account.get(); //checking if user is already logged in 
//         isCurrSession = true;
//     } catch (err) {
//         isCurrSession = false;
//     }

//     if(manRoutes.includes(to.path) && isCurrSession) {
//         alert('DUPA!');
//         next('/');
//     } else {
//         next();
//     }
// });

const app = createApp(App)
app.use(router)
app.mount('#app')
