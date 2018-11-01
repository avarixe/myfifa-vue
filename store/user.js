import $_http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit }, payload) {
    return $_http({
      method: 'post',
      path: myfifa.users.index,
      data: { user: payload },
      success () {
        commit('broadcaster/ANNOUNCE', {
          message: 'Account has been registered!',
          color: 'success'
        }, { root: true })
      }
    })
  },
  update ({ commit }, payload) {
    return $_http({
      method: 'patch',
      path: myfifa.users.record,
      pathData: { userId: payload.id },
      data: { user: payload },
      success () {
        commit('broadcaster/ANNOUNCE', {
          message: 'Account has been updated!',
          color: 'success'
        }, { root: true })
      }
    })
  }
}
