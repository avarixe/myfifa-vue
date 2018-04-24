import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import team from './modules/team'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    team
  },
  strict: debug
})
