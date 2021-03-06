import { Goal } from '@/models'

// actions
export const actions = {
  async create (_, { matchId, goal }) {
    const data = await this.$axios.$post(`matches/${matchId}/goals`, {
      goal
    })
    Goal.insert({ data })
  },
  async update (_, goal) {
    const data = await this.$axios.$patch(`goals/${goal.id}`, {
      goal
    })
    Goal.insert({ data })
  },
  async remove (_, goalId) {
    await this.$axios.$delete(`goals/${goalId}`)
    Goal.delete(goalId)
  }
}
