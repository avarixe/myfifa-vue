import { Stage } from '@/models'

// actions
export const actions = {
  async FETCH (_, { competitionId }) {
    const data = await this.$axios.$get(`competitions/${competitionId}/stages`)
    Stage.insert({ data })
  },
  async CREATE (_, { competitionId, stage }) {
    const data = await this.$axios.$post(
      `competitions/${competitionId}/stages`,
      { stage }
    )
    Stage.insert({ data })
  },
  async UPDATE (_, stage) {
    const data = await this.$axios.$patch(`stages/${stage.id}`, { stage })
    Stage.insert({ data })
  },
  async REMOVE (_, stageId) {
    await this.$axios.$delete(`stages/${stageId}`)
    Stage.delete(stageId)
  }
}
