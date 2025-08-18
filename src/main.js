import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import LoginUser from './views/LoginUser.vue'
import HomePage from './views/HomePage.vue'
import RegisterUser from './views/RegisterUser.vue'
import UserPage from './views/UserPage.vue'
import PlayPage from './views/PlayPage.vue'
import ChallengePage from './views/ChallengePage.vue'
import WordSeachPlay from './views/WordSeachPlay.vue'

const router = createRouter ({
    history: createWebHistory(),
    routes: [
        {path: '/', component: HomePage},
        {path: '/login', component: LoginUser},
        {path: '/register', component: RegisterUser},
        {path: '/user', component: UserPage},
        {path: '/play', component: PlayPage},
        {path: '/challenge', component: ChallengePage},
        {path: '/ws', component: WordSeachPlay},
    ]
});

const app = createApp(App)
app.use(router)
app.mount('#app')
