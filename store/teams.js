import { Team } from '@/models'

// actions
export const actions = {
  async FETCH () {
    const data = await this.$axios.$get('teams')
    Team.insert({ data })
  },
  async GET (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}`)
    Team.insert({ data })
  },
  async CREATE (_, { formData, team }) {
    const data = await this.$axios.$post('teams', formData || { team })
    Team.insert({ data })
    return data
  },
  async UPDATE (_, { formData, team }) {
    const data = await this.$axios.$patch(
      `teams/${team.id}`,
      formData || { team }
    )
    Team.insert({ data })
  },
  async REMOVE (_, teamId) {
    await this.$axios.$delete(`teams/${teamId}`)
    Team.delete(teamId)
  },
  ANALYZE_SEASON (_, { teamId, season }) {
    return this.$axios.$post(`teams/${teamId}/analyze/season/${season}`)
  }
}
