import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import { initWorker } from './worker.api.js'

import FirstPage from '@/components/FirstPage.vue'
import SecondPage from '@/components/SecondPage.vue'

initWorker()

const routes = [
  { path: '/first', component: FirstPage, props: { msg: 'First Page' } },
  { path: '/second', component: SecondPage, props: { msg: 'Second Page' } },
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})

createApp(App).use(router).mount('#app')
