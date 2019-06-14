import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  CREATE ({ rootState }, { stageId, fixture }) {
    return http({
      method: 'post',
      path: myfifa.fixtures.index,
      pathData: { stageId },
      token: rootState.token,
      data: { fixture }
    })
  },
  UPDATE ({ rootState }, fixture) {
    return http({
      method: 'patch',
      path: myfifa.fixtures.record,
      pathData: { fixtureId: fixture.id },
      token: rootState.token,
      data: { fixture }
    })
  },
  REMOVE ({ rootState }, fixtureId) {
    return http({
      method: 'delete',
      path: myfifa.fixtures.record,
      pathData: { fixtureId },
      token: rootState.token
    })
  }
}
