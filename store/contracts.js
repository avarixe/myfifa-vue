import { Contract } from '@/models'

// actions
export const actions = {
  async CREATE (_, { playerId, contract }) {
    const data = await this.$axios.$post(`players/${playerId}/contracts`, {
      contract
    })
    Contract.insert({ data })
  },
  async UPDATE (_, contract) {
    const data = await this.$axios.$patch(`contracts/${contract.id}`, {
      contract
    })
    Contract.insert({ data })
  },
  async REMOVE (_, contractId) {
    await this.$axios.$delete(`contracts/${contractId}`)
    Contract.delete(contractId)
  },
  async SEARCH (_, { teamId, filters }) {
    const data = await this.$axios.$post(`teams/${teamId}/contracts/search`, {
      filters
    })
    Contract.insert({ data })
  }
}
