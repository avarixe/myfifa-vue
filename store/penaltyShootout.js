// actions
export const actions = {
  async create (_, { matchId, penaltyShootout }) {
    const data = await this.$axios.$post(
      `matches/${matchId}/penalty_shootout`,
      { penalty_shootout: penaltyShootout }
    )
    this.$db().model('PenaltyShootout').insert({ data })
  },
  async update (_, { matchId, penaltyShootout }) {
    const data = await this.$axios.$patch(
      `matches/${matchId}/penalty_shootout`,
      { penalty_shootout: penaltyShootout }
    )
    this.$db().model('PenaltyShootout').insert({ data })
  },
  async remove (_, id) {
    const penaltyShootout = this.$db().model('PenaltyShootout')
    const { match_id: matchId } = penaltyShootout.find(id)
    await this.$axios.$delete(`matches/${matchId}/penalty_shootout`)
    penaltyShootout.delete(id)
  }
}
