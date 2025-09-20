import { createRouter, createWebHistory } from 'vue-router'
import { account } from './lib/appwrite'

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
import AchievementsPage from './views/AchievementsPage.vue'
import SettingsPage from './views/SettingsPage.vue'
import NotFound from './views/NotFound.vue'
import HelpPage from './views/HelpPage.vue'

//meta: { requiresAuth: true } - only logged in user can access those
const router = createRouter ({
    history: createWebHistory(),
    routes: [
        {path: '/', component: HomePage},
        {path: '/login', component: LoginUser},
        {path: '/register', component: RegisterUser},
        {path: '/user', component: UserPage, meta: { requiresAuth: true }},
        {path: '/play', component: PlayPage, meta: { requiresAuth: true }},
        {path: '/challenge', component: ChallengePage, meta: { requiresAuth: true }},
        {path: '/wsplay', component: WordSearchPlay, meta: { requiresAuth: true }},
        {path: '/wschallenge', component: WordSearchChallenge, meta: { requiresAuth: true }},
        {path: '/shop', component: ShopPage, meta: { requiresAuth: true }},
        {path: '/profile', component: UserProfile, meta: { requiresAuth: true }},
        {path: '/random', component: RandomPuzzle},
        {path: '/contact', component: ContactForm},
        {path: '/privacy', component: PrivacyPolicy},
        {path: '/terms', component: TermsOfUse},
        {path: '/achievements', component: AchievementsPage, meta: { requiresAuth: true }},
        {path: '/settings', component: SettingsPage, meta: { requiresAuth: true }},
        {path: '/:pathMatch(.*)*', component: NotFound},
        {path: '/help', component: HelpPage, meta: { requiresAuth: true }},
    ]
});

async function getCurrentUser() {
  try {
    return await account.get()
  } catch (err) {
    if (err.code === 401) {
      return null // no session = no log in console
    }
    console.error("Appwrite error:", err)
    return null
  }
}

// navigation guard - after user gets to new route
router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser() //checking current user

  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  if ((to.path === '/login' || to.path === '/') && user) {
    return next('/user')
  }

  next() //letting user go where he wanted to
})

export default router;