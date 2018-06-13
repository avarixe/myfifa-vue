import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import Dashboard from '@/components/Dashboard/Dashboard'
import Login from '@/components/Login'
import Players from '@/components/Players/Players'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/team/:team_id',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/players',
      name: 'Players',
      component: Players
    }
  ],
  mode: 'history'
})
