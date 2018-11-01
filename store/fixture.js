import $_http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { stageId, fixture }) {
    return $_http({
      method: 'post',
      path: myfifa.fixtures.index,
      pathData: { stageId },
      token: rootState.token,
      data: { fixture }
    })
  },
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
