// actions
export const actions = {
  async create (_, { playerId, contract }) {
    const data = await this.$axios.$post(`players/${playerId}/contracts`, {
      contract
    })
    this.$db().model('Contract').insert({ data })
  },
  async update (_, contract) {
    const data = await this.$axios.$patch(`contracts/${contract.id}`, {
      contract
    })
    this.$db().model('Contract').insert({ data })
  },
  async remove (_, contractId) {
    await this.$axios.$delete(`contracts/${contractId}`)
    this.$db().model('Contract').delete(contractId)
  },
  async search (_, { teamId, filters }) {
    const data = await this.$axios.$post(`teams/${teamId}/contracts/search`, {
      filters
    })
    this.$db().model('Contract').insert({ data })
  }
}
