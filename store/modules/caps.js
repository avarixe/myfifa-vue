import http from '@/api'
import myfifa from '@/api/myfifa'
import { Cap } from '@/models'

// actions
const actions = {
  FETCH ({ rootState }, { matchId }) {
    return http({
      path: myfifa.caps.index,
      pathData: { matchId },
      token: rootState.session.token,
      success: ({ data }) => { Cap.insert({ data }) }
    })
  },
  GET ({ rootState }, { capId }) {
    return http({
      path: myfifa.caps.record,
      pathData: { capId },
      token: rootState.session.token
    })
  },
  CREATE ({ rootState }, { matchId, cap }) {
    return http({
      method: 'post',
      path: myfifa.caps.index,
      pathData: { matchId },
      token: rootState.session.token,
      data: { cap }
    })
  },
  UPDATE ({ rootState }, cap) {
    return http({
      method: 'patch',
      path: myfifa.caps.record,
      pathData: { capId: cap.id },
      token: rootState.session.token,
      data: { cap }
    })
  }
}

export default {
  namespaced: true,
  actions
}
