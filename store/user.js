import { http, routes } from '@/api'

// actions
export const actions = {
  GET ({ rootState }) {
    return http({
      path: routes.users.sync,
      token: rootState.token
    })
  },
  CREATE ({ commit }, user) {
    return http({
      method: 'post',
      path: routes.users.record,
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
      path: routes.users.record,
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
