// actions
export const actions = {
  async create (_, { matchId, cap }) {
    const data = await this.$axios.$post(`matches/${matchId}/caps`, { cap })
    this.$db().model('Cap').insert({ data })
  },
  async update (_, cap) {
    const data = await this.$axios.$patch(`caps/${cap.id}`, { cap })
    this.$db().model('Cap').insert({ data })
  }
}
