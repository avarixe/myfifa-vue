// actions
export const actions = {
  async fetch () {
    const data = await this.$axios.$get('teams')
    this.$db().model('Team').insert({ data })
  },
  async get (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}`)
    this.$db().model('Team').insert({ data })
  },
  async create (_, { formData, team }) {
    const data = await this.$axios.$post('teams', formData || { team })
    this.$db().model('Team').insert({ data })
    return data
  },
  async update (_, { formData, team }) {
    const data = await this.$axios.$patch(
      `teams/${team.id}`,
      formData || { team }
    )
    this.$db().model('Team').insert({ data })
  },
  async remove (_, teamId) {
    await this.$axios.$delete(`teams/${teamId}`)
    this.$db().model('Team').delete(teamId)
  },
  analyzeSeason (_, { teamId, season }) {
    return this.$axios.$post(`teams/${teamId}/analyze/season/${season}`)
  }
}
