import { Contract } from '@/models'

// actions
export const actions = {
  async create (_, { playerId, contract }) {
    const data = await this.$axios.$post(`players/${playerId}/contracts`, {
      contract
    })
    Contract.insert({ data })
  },
  async update (_, contract) {
    const data = await this.$axios.$patch(`contracts/${contract.id}`, {
      contract
    })
    Contract.insert({ data })
  },
  async remove (_, contractId) {
    await this.$axios.$delete(`contracts/${contractId}`)
    Contract.delete(contractId)
  },
  async search (_, { teamId, filters }) {
    const data = await this.$axios.$post(`teams/${teamId}/contracts/search`, {
      filters
    })
    Contract.insert({ data })
  }
}
