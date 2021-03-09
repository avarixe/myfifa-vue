// actions
export const actions = {
  async fetch (_, { competitionId }) {
    const data = await this.$axios.$get(`competitions/${competitionId}/stages`)
    this.$db().model('Stage').insert({ data })
  },
  async create (_, { competitionId, stage }) {
    const data = await this.$axios.$post(
      `competitions/${competitionId}/stages`,
      { stage }
    )
    this.$db().model('Stage').insert({ data })
  },
  async update (_, stage) {
    const data = await this.$axios.$patch(`stages/${stage.id}`, { stage })
    this.$db().model('Stage').insert({ data })
  },
  async remove (_, stageId) {
    await this.$axios.$delete(`stages/${stageId}`)
    this.$db().model('Stage').delete(stageId)
  }
}
