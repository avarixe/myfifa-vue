// actions
export const actions = {
  async create (_, { stageId, fixture }) {
    const data = await this.$axios.$post(`stages/${stageId}/fixtures`, {
      fixture
    })
    this.$db().model('Fixture').insert({ data })
  },
  async update (_, fixture) {
    const data = await this.$axios.$patch(`fixtures/${fixture.id}`, { fixture })
    this.$db().model('Fixture').insert({ data })
  },
  async remove (_, fixtureId) {
    await this.$axios.$delete(`fixtures/${fixtureId}`)
    this.$db().model('Fixture').delete(fixtureId)
  }
}
