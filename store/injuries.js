// actions
export const actions = {
  async create (_, { playerId, injury }) {
    const data = await this.$axios.$post(`players/${playerId}/injuries`, {
      injury
    })
    this.$db().model('Injury').insert({ data })
  },
  async update (_, injury) {
    const data = await this.$axios.$patch(`injuries/${injury.id}`, {
      injury
    })
    this.$db().model('Injury').insert({ data })
  },
  async remove (_, injuryId) {
    await this.$axios.$delete(`injuries/${injuryId}`)
    this.$db().model('Injury').delete(injuryId)
  }
}
