import { crud, http, routes } from '@/api'
import { Team } from '@/models'

// actions
export const actions = {
  ...crud({ model: Team }),
  FETCH ({ commit, rootState }) {
    return http({
      path: routes.teams.index,
      token: rootState.token,
      success ({ data }) {
        Team.insert({ data })
      }
    })
  },
  CREATE ({ commit, rootState }, team) {
    return http({
      method: 'post',
      path: routes.teams.index,
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
      path: routes.analyze.season,
      pathData: { teamId, season },
      token: rootState.token
    })
  }
}
