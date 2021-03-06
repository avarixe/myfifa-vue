import { Team } from '@/models'

// actions
export const actions = {
  async fetch () {
    const data = await this.$axios.$get('teams')
    Team.insert({ data })
  },
  async get (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}`)
    Team.insert({ data })
  },
  async create (_, { formData, team }) {
    const data = await this.$axios.$post('teams', formData || { team })
    Team.insert({ data })
    return data
  },
  async update (_, { formData, team }) {
    const data = await this.$axios.$patch(
      `teams/${team.id}`,
      formData || { team }
    )
    Team.insert({ data })
  },
  async remove (_, teamId) {
    await this.$axios.$delete(`teams/${teamId}`)
    Team.delete(teamId)
  },
  analyzeSeason (_, { teamId, season }) {
    return this.$axios.$post(`teams/${teamId}/analyze/season/${season}`)
  }
}
