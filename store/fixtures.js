import { gql } from 'nuxt-graphql-request'
import { fixtureFragment } from '~/fragments'

// actions
export const actions = {
  async create (_, { stageId, attributes }) {
    const query = gql`
      mutation createFixture($stageId: ID!, $attributes: FixtureAttributes!) {
        addFixture(stageId: $stageId, attributes: $attributes) {
          fixture { ...FixtureData }
        }
      }
      ${fixtureFragment}
    `

    await this.$graphql.default.request(query, { stageId, attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: FixtureAttributes!) {
        updateFixture(id: $id, attributes: $attributes) {
          fixture { ...FixtureData }
        }
      }
      ${fixtureFragment}
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeFixture($id: ID!) {
        removeFixture(id: $id) {
          fixture { ...FixtureData }
        }
      }
      ${fixtureFragment}
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Fixture').delete(id)
  }
}
