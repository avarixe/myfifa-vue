// actions
export const actions = {
  async fetch (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/competitions`)
    this.$db().model('Competition').insert({ data })
  },
  async get (_, { competitionId }) {
    const data = await this.$axios.$get(`competitions/${competitionId}`)
    this.$db().model('Competition').insert({ data })
  },
  async create (_, { teamId, competition }) {
    const data = await this.$axios.$post(`teams/${teamId}/competitions`, {
      competition
    })
    this.$db().model('Competition').insert({ data })
    return data
  },
  async update (_, competition) {
    const data = await this.$axios.$patch(`competitions/${competition.id}`, {
      competition
    })
    this.$db().model('Competition').insert({ data })
  },
  async remove (_, competitionId) {
    await this.$axios.$delete(`competitions/${competitionId}`)
    this.$db().model('Competition').delete(competitionId)
  }
}
