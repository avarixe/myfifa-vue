import { Injury } from '@/models'

// actions
export const actions = {
  async CREATE (_, { playerId, injury }) {
    const data = await this.$axios.$post(`players/${playerId}/injuries`, {
      injury
    })
    Injury.insert({ data })
  },
  async UPDATE (_, injury) {
    const data = await this.$axios.$patch(`injuries/${injury.id}`, {
      injury
    })
    Injury.insert({ data })
  },
  async REMOVE (_, injuryId) {
    await this.$axios.$delete(`injuries/${injuryId}`)
    Injury.delete(injuryId)
  }
}
