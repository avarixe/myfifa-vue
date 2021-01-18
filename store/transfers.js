import { Transfer } from '@/models'

// actions
export const actions = {
  async CREATE (_, { playerId, transfer }) {
    const data = await this.$axios.$post(`players/${playerId}/transfers`, {
      transfer
    })
    Transfer.insert({ data })
  },
  async UPDATE (_, transfer) {
    const data = await this.$axios.$patch(`transfers/${transfer.id}`, {
      transfer
    })
    Transfer.insert({ data })
  },
  async REMOVE (_, transferId) {
    await this.$axios.$delete(`transfers/${transferId}`)
    Transfer.delete(transferId)
  },
  async SEARCH (_, { teamId, filters }) {
    const data = await this.$axios.$post(`teams/${teamId}/transfers/search`, {
      filters
    })
    Transfer.insert({ data })
  }
}
