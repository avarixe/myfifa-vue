// actions
export const actions = {
  async create (_, { matchId, goal }) {
    const data = await this.$axios.$post(`matches/${matchId}/goals`, {
      goal
    })
    this.$db().model('Goal').insert({ data })
  },
  async update (_, goal) {
    const data = await this.$axios.$patch(`goals/${goal.id}`, {
      goal
    })
    this.$db().model('Goal').insert({ data })
  },
  async remove (_, goalId) {
    await this.$axios.$delete(`goals/${goalId}`)
    this.$db().model('Goal').delete(goalId)
  }
}
