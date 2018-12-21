import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
const actions = {
  GET ({ rootState }) {
    return http({
      path: myfifa.users.sync,
      token: rootState.session.token
    })
  },
  CREATE ({ commit }, user) {
    return http({
      method: 'post',
      path: myfifa.users.record,
      data: { user },
      success () {
        commit('broadcaster/ANNOUNCE', {
          message: 'Account has been registered!',
          color: 'success'
        }, { root: true })
      }
    })
  },
  UPDATE ({ commit, rootState }, user) {
    return http({
      method: 'patch',
      path: myfifa.users.record,
      token: rootState.session.token,
      data: { user },
      success () {
        commit('broadcaster/ANNOUNCE', {
          message: 'Account has been updated!',
          color: 'success'
        }, { root: true })
      }
    })
  }
}

export default {
  namespaced: true,
  actions
}
