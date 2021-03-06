import { Competition } from '@/models'

// actions
export const actions = {
  async fetch (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/competitions`)
    Competition.insert({ data })
  },
  async get (_, { competitionId }) {
    const data = await this.$axios.$get(`competitions/${competitionId}`)
    Competition.insert({ data })
  },
  async create (_, { teamId, competition }) {
    const data = await this.$axios.$post(`teams/${teamId}/competitions`, {
      competition
    })
    Competition.insert({ data })
    return data
  },
  async update (_, competition) {
    const data = await this.$axios.$patch(`competitions/${competition.id}`, {
      competition
    })
    Competition.insert({ data })
  },
  async remove (_, competitionId) {
    await this.$axios.$delete(`competitions/${competitionId}`)
    Competition.delete(competitionId)
  }
}
