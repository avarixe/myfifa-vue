import { Match, Cap } from '@/models'

// state
export const state = () => ({
  teamOptions: []
})

// mutations
export const mutations = {
  setTeamOptions (state, teamOptions) {
    state.teamOptions = teamOptions
  }
}

// actions
export const actions = {
  async fetch (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/matches`)
    Match.insert({ data })
  },
  async get (_, { matchId }) {
    const data = await this.$axios.$get(`matches/${matchId}`)
    Match.insert({ data })
  },
  async create (_, { teamId, match }) {
    const data = await this.$axios.$post(`teams/${teamId}/matches`, { match })
    Match.insert({ data })
    return data
  },
  async update (_, match) {
    const data = await this.$axios.$patch(`matches/${match.id}`, { match })
    Match.insert({ data })
  },
  async remove (_, matchId) {
    await this.$axios.$delete(`matches/${matchId}`)
    Match.delete(matchId)
  },
  async applySquad (_, { matchId, squadId }) {
    const data = await this.$axios.$post(
      `matches/${matchId}/apply_squad/${squadId}`
    )
    Cap.delete(cap => cap.match_id === matchId)
    Match.insert({ data })
  },
  async fetchTeamOptions ({ commit }, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/matches/team_options`)
    commit('setTeamOptions', data)
  }
}
