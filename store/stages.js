// actions
export const actions = {
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
