import Vue from 'vue'
import Router from 'vue-router'
import Teams from '@/components/teams'
import Dashboard from '@/components/teams/dashboard'
import Login from '@/components/login'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/teams' },
    { path: '/teams', component: Teams },
    { path: '/login', component: Login },
    { path: '/teams/:teamId', component: Dashboard }
  ],
  mode: 'history'
})
