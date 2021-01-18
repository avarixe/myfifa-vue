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
  async FETCH (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/matches`)
    Match.insert({ data })
  },
  async GET (_, { matchId }) {
    const data = await this.$axios.$get(`matches/${matchId}`)
    Match.insert({ data })
  },
  async CREATE (_, { teamId, match }) {
    const data = await this.$axios.$post(`teams/${teamId}/matches`, { match })
    Match.insert({ data })
    return data
  },
  async UPDATE (_, match) {
    const data = await this.$axios.$patch(`matches/${match.id}`, { match })
    Match.insert({ data })
  },
  async REMOVE (_, matchId) {
    await this.$axios.$delete(`matches/${matchId}`)
    Match.delete(matchId)
  },
  async APPLY_SQUAD (_, { matchId, squadId }) {
    const data = await this.$axios.$post(
      `matches/${matchId}/apply_squad/${squadId}`
    )
    Cap.delete(cap => cap.match_id === matchId)
    Match.insert({ data })
  },
  async FETCH_TEAM_OPTIONS ({ commit }, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/matches/team_options`)
    commit('SET_TEAM_OPTIONS', data)
  }
}
