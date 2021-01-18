import { Cap } from '@/models'

// actions
export const actions = {
  async CREATE (_, { matchId, cap }) {
    const data = await this.$axios.$post(`matches/${matchId}/caps`, { cap })
    Cap.insert({ data })
  },
  async UPDATE (_, cap) {
    const data = await this.$axios.$patch(`caps/${cap.id}`, { cap })
    Cap.insert({ data })
  }
}
