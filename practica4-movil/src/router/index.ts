import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import AboutPage from '@/views/AboutPage.vue';
import CookiesView from '@/views/legal/CookiesPage.vue';
import RecipeDetailPage from '../views/RecipeDetailPage.vue';
import ListPage from '../views/ListPage.vue';
import ContactPage from '@/views/ContactPage.vue';
import PrivacidadPage from '@/views/legal/PrivacidadPage.vue';
import LegalPage from '@/views/legal/LegalPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import CommentsPage from '@/views/CommentsPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import CreateEditPage from '../views/CreateEditPage.vue';

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
  },{
    path: '/contact',
    name: 'contact',
    component: ContactPage
  },{
    path: '/privacidad',
    name: 'privacidad',
    component: PrivacidadPage
  },{
    path: '/legal',
    name: 'legal',
    component: LegalPage
  },{
    path: '/login',
    name: 'login',
    component: LoginPage
  },{
    path: '/register',
    name: 'register',
    component: RegisterPage
  },{
    path: '/comments',
    name: 'comments',
    component: CommentsPage
  },{
    path: '/profile',
    name: 'profile',
    component: ProfilePage
  },{
    path: '/create-edit/:id?',
    name: 'CreateEdit',
    component: CreateEditPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router