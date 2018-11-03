import $_http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit }, user) {
    return $_http({
      method: 'post',
      path: myfifa.users.index,
      data: { user },
      success () {
        commit('broadcaster/ANNOUNCE', {
          message: 'Account has been registered!',
          color: 'success'
        }, { root: true })
      }
    })
  },
  update ({ commit }, user) {
    return $_http({
      method: 'patch',
      path: myfifa.users.record,
      pathData: { userId: user.id },
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
