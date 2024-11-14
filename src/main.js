import { createApp } from 'vue'
import App from './App.vue'
import router from "./plugins/router";
import '@/assets/css/style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
// import VueLazyLoad from 'vue3-lazyload'

const app = createApp(App).use(router).use(ElementPlus).use(PerfectScrollbar)

app.mount('#app')
