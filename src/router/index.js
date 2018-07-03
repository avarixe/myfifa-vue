import Vue from 'vue'
import Router from 'vue-router'
import Teams from '@/components/teams'
import Dashboard from '@/components/teams/dashboard'
import Login from '@/components/login'
import store from '../store'

Vue.use(Router)

function requireLogin (to, from, next) {
  if (store.getters['user/authenticated']) {
    next()
  } else {
    next('/login')
  }
}

export default new Router({
  routes: [
    { path: '/', redirect: '/teams' },
    { path: '/login', component: Login },
    { path: '/teams', component: Teams, beforeEnter: requireLogin },
    { path: '/teams/:teamId', component: Dashboard, beforeEnter: requireLogin }
  ],
  mode: 'history'
})
