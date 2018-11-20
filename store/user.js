import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  get ({ rootState }) {
    return http({
      path: myfifa.users.sync,
      token: rootState.token
    })
  },
  create ({ commit }, user) {
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
  update ({ commit, rootState }, user) {
    return http({
      method: 'patch',
      path: myfifa.users.record,
      token: rootState.token,
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
