import http from '@/api'
import myfifa from '@/api/myfifa'
import { Cap } from '@/models'

// actions
export const actions = {
  SEARCH ({ rootState }, { teamId }) {
    return http({
      method: 'post',
      path: myfifa.caps.search,
      pathData: { teamId },
      token: rootState.token,
      success: ({ data }) => { Cap.insert({ data }) }
    })
  },
  FETCH ({ rootState }, { matchId }) {
    return http({
      path: myfifa.caps.index,
      pathData: { matchId },
      token: rootState.token,
      success: ({ data }) => { Cap.insert({ data }) }
    })
  },
  GET ({ rootState }, { capId }) {
    return http({
      path: myfifa.caps.record,
      pathData: { capId },
      token: rootState.token
    })
  },
  CREATE ({ rootState }, { matchId, cap }) {
    return http({
      method: 'post',
      path: myfifa.caps.index,
      pathData: { matchId },
      token: rootState.token,
      data: { cap }
    })
  },
  UPDATE ({ rootState }, cap) {
    return http({
      method: 'patch',
      path: myfifa.caps.record,
      pathData: { capId: cap.id },
      token: rootState.token,
      data: { cap }
    })
  }
}
