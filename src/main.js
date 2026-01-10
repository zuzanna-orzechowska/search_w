import { createApp } from 'vue'
import router from './routes'
import App from './App.vue'
import clickOutsideDirective from './clickOutsideDirective'
import { createPinia } from 'pinia'
import './assets/tailwind.css'

const app = createApp(App)
app.use(router)
app.directive('click-outside', clickOutsideDirective);
app.use(createPinia())
app.mount('#app')
