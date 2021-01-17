import { http, routes } from '@/api'

// actions
export const actions = {
  GET () {
    return this.$axios.$get(routes.users.sync)
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
