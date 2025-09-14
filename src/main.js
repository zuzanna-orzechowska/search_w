import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import LoginUser from './views/LoginUser.vue'
import HomePage from './views/HomePage.vue'
import RegisterUser from './views/RegisterUser.vue'
import UserPage from './views/UserPage.vue'
import PlayPage from './views/PlayPage.vue'
import ChallengePage from './views/ChallengePage.vue'
import WordSearchPlay from './views/WordSearchPlay.vue'
import WordSearchChallenge from './views/WordSearchChallenge.vue'
import ShopPage from './views/ShopPage.vue'
import UserProfile from './views/UserProfile.vue'
import RandomPuzzle from './views/RandomPuzzle.vue'
import ContactForm from './views/ContactForm.vue'
import PrivacyPolicy from './views/PrivacyPolicy.vue'
import TermsOfUse from './views/TermsOfUse.vue'

const router = createRouter ({
    history: createWebHistory(),
    routes: [
        {path: '/', component: HomePage},
        {path: '/login', component: LoginUser},
        {path: '/register', component: RegisterUser},
        {path: '/user', component: UserPage},
        {path: '/play', component: PlayPage},
        {path: '/challenge', component: ChallengePage},
        {path: '/wsplay', component: WordSearchPlay},
        {path: '/wschallenge', component: WordSearchChallenge},
        {path: '/shop', component: ShopPage},
        {path: '/profile', component: UserProfile},
        {path: '/random', component: RandomPuzzle},
        {path: '/contact', component: ContactForm},
        {path: '/privacy', component: PrivacyPolicy},
        {path: '/terms', component: TermsOfUse},
    ]
});

const app = createApp(App)
app.use(router)
app.mount('#app')
