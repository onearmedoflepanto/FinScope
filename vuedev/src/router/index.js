import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DetailView from '@/views/DetailView.vue'
import MyPageView from '@/views/MyPageview.vue'
import AuthView from '@/views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/detail/:name', component: DetailView },
    { path: '/mypage', component: MyPageView },
    { path: '/auth', component: AuthView },
  ]
})

export default router
