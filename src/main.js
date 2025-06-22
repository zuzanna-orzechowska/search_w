import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

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

const app = createApp(App)
app.use(router)
app.mount('#app')
