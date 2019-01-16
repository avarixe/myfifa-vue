import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'

import database from './database'
import app from './modules/app'
import broadcaster from './modules/broadcaster'
import user from './modules/user'
import session from './modules/session'

Vue.use(Vuex)

function createStore () {
  return new Vuex.Store({
    modules: {
      app,
      broadcaster,
      user,
      session
    },

    plugins: [VuexORM.install(database)]
  })
}

export default createStore
