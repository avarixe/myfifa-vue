import { gql } from 'nuxt-graphql-request'
import { capFragment } from '@/fragments'

// actions
export const actions = {
  async create (_, { matchId, attributes }) {
    const query = gql`
      mutation createCap($matchId: ID!, $attributes: CapAttributes!) {
        addCap(matchId: $matchId, attributes: $attributes) {
        }
      }
    `

    await this.$graphql.default.request(query, { matchId, attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: CapAttributes!) {
        updateCap(id: $id, attributes: $attributes) {
          cap { ...CapData }
        }
      }
      ${capFragment}
    `

    const { updateCap: { cap } } =
      await this.$graphql.default.request(query, { id, attributes })

    this.$db().model('Cap').insertOrUpdate({ data: cap })
  }
}
