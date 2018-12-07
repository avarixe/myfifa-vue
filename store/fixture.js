import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { stageId, fixture }) {
    return http({
      method: 'post',
      path: myfifa.fixtures.index,
      pathData: { stageId },
      token: rootState.session.token,
      data: { fixture }
    })
  },
  update ({ commit, rootState }, fixture) {
    return http({
      method: 'patch',
      path: myfifa.fixtures.record,
      pathData: { fixtureId: fixture.id },
      token: rootState.session.token,
      data: { fixture }
    })
  }
}
