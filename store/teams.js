import http from '@/api'
import myfifa from '@/api/myfifa'
import { crud } from '@/api/actions'
import { Team } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Team,
    route: 'teams',
    parentId: 'teamId',
    recordId: 'teamId',
    dataName: 'team'
  }),
  FETCH ({ commit, rootState }) {
    return http({
      path: myfifa.teams.index,
      token: rootState.token,
      success ({ data }) {
        Team.insert({ data })
      }
    })
  },
  CREATE ({ commit, rootState }, team) {
    return http({
      method: 'post',
      path: myfifa.teams.index,
      token: rootState.token,
      data: { team },
      success ({ data }) {
        Team.insert({ data })
      }
    })
  },
  ANALYZE_SEASON ({ rootState }, { teamId, season }) {
    return http({
      method: 'post',
      path: myfifa.analyze.season,
      pathData: { teamId, season },
      token: rootState.token
    })
  }
}
