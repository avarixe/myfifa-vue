// actions
export const actions = {
  async create (_, { playerId, transfer }) {
    const data = await this.$axios.$post(`players/${playerId}/transfers`, {
      transfer
    })
    this.$db().model('Transfer').insert({ data })
  },
  async update (_, transfer) {
    const data = await this.$axios.$patch(`transfers/${transfer.id}`, {
      transfer
    })
    this.$db().model('Transfer').insert({ data })
  },
  async remove (_, transferId) {
    await this.$axios.$delete(`transfers/${transferId}`)
    this.$db().model('Transfer').delete(transferId)
  },
  async search (_, { teamId, filters }) {
    const data = await this.$axios.$post(`teams/${teamId}/transfers/search`, {
      filters
    })
    this.$db().model('Transfer').insert({ data })
  }
}
