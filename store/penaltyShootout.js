// actions
export const actions = {
  async create (_, { matchId, penaltyShootout }) {
    const data = await this.$axios.$post(
      `matches/${matchId}/penaltyShootout`,
      { penaltyShootout: penaltyShootout }
    )
    this.$db().model('PenaltyShootout').insert({ data })
  },
  async update (_, { matchId, penaltyShootout }) {
    const data = await this.$axios.$patch(
      `matches/${matchId}/penaltyShootout`,
      { penaltyShootout: penaltyShootout }
    )
    this.$db().model('PenaltyShootout').insert({ data })
  },
  async remove (_, id) {
    const penaltyShootout = this.$db().model('PenaltyShootout')
    const { matchId } = penaltyShootout.find(id)
    await this.$axios.$delete(`matches/${matchId}/penaltyShootout`)
    penaltyShootout.delete(id)
  }
}
