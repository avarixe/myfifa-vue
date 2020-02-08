import { crud, http, routes } from '@/api'
import { Match, Cap } from '@/models'

// state
export const state = () => ({
  teamOptions: []
})

// mutations
export const mutations = {
  SET_TEAM_OPTIONS (state, teamOptions) {
    state.teamOptions = teamOptions
  }
}

// actions
export const actions = {
  ...crud({
    model: Match,
    parent: 'team'
  }),
  APPLY_SQUAD ({ rootState }, { matchId, squadId }) {
    return http({
      method: 'post',
      path: routes.matches.applySquad,
      pathData: { matchId, squadId },
      token: rootState.token,
      success ({ data }) {
        Cap.delete(cap => cap.match_id === matchId)
        Match.insert({ data })
      }
    })
  },
  FETCH_TEAM_OPTIONS ({ commit, rootState }, { teamId }) {
    return http({
      method: 'get',
      path: routes.matches.teamOptions,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        commit('SET_TEAM_OPTIONS', data)
      }
    })
  }
}
