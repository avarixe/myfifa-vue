import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Teams from '@/components/teams'
import Dashboard from '@/components/teams/dashboard'
import store from '../store'

Vue.use(Router)

function requireLogin (to, from, next) {
  if (store.getters['user/authenticated']) {
    next()
  } else {
    next('/')
  }
}

export default new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/teams', component: Teams, beforeEnter: requireLogin },
    { path: '/teams/:teamId', component: Dashboard, beforeEnter: requireLogin }
  ],
  mode: 'history'
})
