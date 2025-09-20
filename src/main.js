import { createApp } from 'vue'
import router from './routes'
import App from './App.vue'
import clickOutsideDirective from './clickOutsideDirective'

const app = createApp(App)
app.use(router)
app.directive('click-outside', clickOutsideDirective);
app.mount('#app')
