import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async save (_, { matchId, attributes }) {
    const query = gql`
      mutation savePenaltyShootout($matchId: ID!, $attributes: PenaltyShootoutAttributes!) {
        updateMatch(id: $matchId, attributes: { penaltyShootoutAttributes: $attributes }) {
          match { id }
        }
      }
    `

    await this.$graphql.default.request(query, { matchId, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removePenaltyShootout($id: ID!) {
        removePenaltyShootout(id: $id) {
          penaltyShootout { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('PenaltyShootout').delete(id)
  }
}
