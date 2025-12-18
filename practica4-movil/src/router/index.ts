import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import AboutPage from '@/views/AboutPage.vue';
import CookiesView from '@/views/legal/CookiesView.vue';
import RecipeDetailPage from '../views/RecipeDetailPage.vue';
import ListPage from '../views/ListPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },{
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: RecipeDetailPage
  },{
    path: '/about',
    name: 'About',
    component: AboutPage
  },{
    path: '/cookies',
    name: 'cookies',
    component: CookiesView
  },{
    path: '/list',
    name: 'List',
    component: ListPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router