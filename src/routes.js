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
import VerifyEmail from './views/VerifyEmail.vue'
import CheckEmail from './views/CheckEmail.vue'
import ResetPassword from './views/ResetPassword.vue'
import ForgotPassword from './views/ForgotPassword.vue'

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
        {path: '/verify', component: VerifyEmail},
        {path: '/check', component: CheckEmail},
        {path: '/forgot', component: ForgotPassword},
        {path: '/reset', component: ResetPassword}

    ]
});

async function getCurrentUser() {
  try {
    const user = await account.get()
    
    //checking if user has verification
    if (!user.emailVerification) {
      // user only have permission if status of his email is verified
      return { ...user, isVerified: false }; 
    }
    
    return { ...user, isVerified: true };
  } catch (err) {
    if (err.code === 401) {
      return null
    }
    console.error("Appwrite error:", err)
    return null
  }
}

// navigation guard - after user gets to new route
router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser() 
  
  const requiresAuth = to.meta.requiresAuth;
  const isVerificationRoute = to.path === '/check' || to.path === '/verify';
  
  // user not logged in
  if (requiresAuth && !user) {
    return next('/');
  }

  //user logged in but not verified - force to stay in /check if link is not clicked
  if (user && !user.isVerified) {
    //if user wants to go back to any other page
    if (requiresAuth && !isVerificationRoute) {
      return next('/check'); 
    }
    //forcing to /check
    if ((to.path === '/login' || to.path === '/register' || to.path === '/') && !isVerificationRoute) {
        return next('/check');
    }
  }

  //user logged in and verified
  if (user && user.isVerified) {
    if (to.path === '/login' || to.path === '/' || isVerificationRoute) {
      return next('/user');
    }
  }
  next() 
})

export default router;