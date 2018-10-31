import $_http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  update ({ commit, rootState }, payload) {
    return $_http({
      method: 'patch',
      path: myfifa.fixtures.record,
      pathData: { fixtureId: payload.id },
      token: rootState.token,
      data: { fixture: payload }
    })
  }
}
