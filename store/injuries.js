import { gql } from 'nuxt-graphql-request'
import { injuryFragment } from '~/fragments'

// actions
export const actions = {
  async create (_, { playerId, attributes }) {
    const query = gql`
      mutation createInjury($playerId: ID!, $attributes: InjuryAttributes!) {
        addInjury(playerId: $playerId, attributes: $attributes) {
          injury { ...InjuryData }
        }
      }
      ${injuryFragment}
    `

    await this.$graphql.default.request(query, { playerId, attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: InjuryAttributes!) {
        updateInjury(id: $id, attributes: $attributes) {
          injury { ...InjuryData }
        }
      }
      ${injuryFragment}
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeInjury($id: ID!) {
        removeInjury(id: $id) {
          injury { ...InjuryData }
        }
      }
      ${injuryFragment}
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Injury').delete(id)
  }
}
