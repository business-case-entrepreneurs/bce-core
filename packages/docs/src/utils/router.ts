import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', component: () => import('../views/view-home') },
    { path: '/button', component: () => import('../views/view-button') },
    { path: '/input', component: () => import('../views/view-input.vue') },
    { path: '/message', component: () => import('../views/view-message') },
    { path: '/other', component: () => import('../views/view-other') }
  ]
});
