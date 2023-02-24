import { gql } from 'nuxt-graphql-request'
import { goalFragment } from '~/fragments'

// actions
export const actions = {
  async create (_, { matchId, attributes }) {
    const query = gql`
      mutation createGoal($matchId: ID!, $attributes: GoalAttributes!) {
        addGoal(matchId: $matchId, attributes: $attributes) {
          goal { ...GoalData }
        }
      }
      ${goalFragment}
    `

    await this.$graphql.default.request(query, { matchId, attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: GoalAttributes!) {
        updateGoal(id: $id, attributes: $attributes) {
          goal { ...GoalData }
        }
      }
      ${goalFragment}
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeGoal($id: ID!) {
        removeGoal(id: $id) {
          goal { ...GoalData }
        }
      }
      ${goalFragment}
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Goal').delete(id)
  }
}
