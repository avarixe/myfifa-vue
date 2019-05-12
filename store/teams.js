import http from '@/api'
import myfifa from '@/api/myfifa'
import { Team } from '@/models'

function saveTeam ({ data }) {
  Team.insert({ data })
}

// actions
export const actions = {
  FETCH ({ commit, rootState }) {
    return http({
      path: myfifa.teams.index,
      token: rootState.token,
      success: saveTeam
    })
  },
  GET ({ commit, rootState }, { teamId }) {
    return http({
      path: myfifa.teams.record,
      pathData: { teamId },
      token: rootState.token,
      success: saveTeam
    })
  },
  ANALYZE_SEASON ({ rootState }, { teamId, season }) {
    return http({
      method: 'post',
      path: myfifa.analyze.season,
      pathData: { teamId, season },
      token: rootState.token
    })
  },
  CREATE ({ commit, rootState }, team) {
    return http({
      method: 'post',
      path: myfifa.teams.index,
      token: rootState.token,
      data: { team },
      success: saveTeam
    })
  },
  UPDATE ({ commit, rootState }, team) {
    return http({
      method: 'patch',
      path: myfifa.teams.record,
      pathData: { teamId: team.id },
      token: rootState.token,
      data: { team },
      success: saveTeam
    })
  },
  REMOVE ({ commit, rootState }, teamId) {
    return http({
      method: 'delete',
      path: myfifa.teams.record,
      pathData: { teamId },
      token: rootState.token,
      success: ({ data }) => {
        Team.delete(data.id)
      }
    })
  }
}
