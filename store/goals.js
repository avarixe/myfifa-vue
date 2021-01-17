import { Goal } from '@/models'

// actions
export const actions = {
  async CREATE (_, { matchId, goal }) {
    const data = await this.$axios.$post(`matches/${matchId}/goals`, {
      goal
    })
    Goal.insert({ data })
  },
  async UPDATE (_, goal) {
    const data = await this.$axios.$patch(`goals/${goal.id}`, {
      goal
    })
    Goal.insert({ data })
  },
  async REMOVE (_, goalId) {
    await this.$axios.$delete(`goals/${goalId}`)
    Goal.delete(goalId)
  }
}
