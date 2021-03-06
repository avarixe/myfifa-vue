import { PenaltyShootout } from '@/models'

// actions
export const actions = {
  async create (_, { matchId, penaltyShootout }) {
    const data = await this.$axios.$post(
      `matches/${matchId}/penalty_shootout`,
      { penalty_shootout: penaltyShootout }
    )
    PenaltyShootout.insert({ data })
  },
  async update (_, { matchId, penaltyShootout }) {
    const data = await this.$axios.$patch(
      `matches/${matchId}/penalty_shootout`,
      { penalty_shootout: penaltyShootout }
    )
    PenaltyShootout.insert({ data })
  },
  async remove (_, id) {
    const { match_id: matchId } = PenaltyShootout.find(id)
    await this.$axios.$delete(`matches/${matchId}/penalty_shootout`)
    PenaltyShootout.delete(id)
  }
}
