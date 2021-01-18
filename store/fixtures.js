import { Fixture } from '@/models'

// actions
export const actions = {
  async CREATE (_, { stageId, fixture }) {
    const data = await this.$axios.$post(`stages/${stageId}/fixtures`, {
      fixture
    })
    Fixture.insert({ data })
  },
  async UPDATE (_, fixture) {
    const data = await this.$axios.$patch(`fixtures/${fixture.id}`, { fixture })
    Fixture.insert({ data })
  },
  async REMOVE (_, fixtureId) {
    await this.$axios.$delete(`fixtures/${fixtureId}`)
    Fixture.delete(fixtureId)
  }
}
