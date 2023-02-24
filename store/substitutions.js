import { gql } from 'nuxt-graphql-request'
import { playerHistoryFragment } from '@/fragments'

// actions
export const actions = {
  async create (_, { matchId, attributes }) {
    const query = gql`
      mutation createSubstitution($matchId: ID!, $attributes: SubstitutionAttributes!) {
        addSubstitution(matchId: $matchId, attributes: $attributes) {
          substitution {
            id
            replacement {
              id
              histories { ...PlayerHistoryData }
            }
          }
        }
      }
      ${playerHistoryFragment}
    `

    const { addSubstitution: { substitution } } =
      await this.$graphql.default.request(query, { matchId, attributes })

    this.$db().model('Substitution').insertOrUpdate({ data: substitution })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: SubstitutionAttributes!) {
        updateSubstitution(id: $id, attributes: $attributes) {
          substitution {
            id
            player {
              id
              histories { ...PlayerHistoryData }
            }
            replacement {
              id
              histories { ...PlayerHistoryData }
            }
          }
        }
      }
      ${playerHistoryFragment}
    `

    const { updateSubstitution: { substitution } } =
      await this.$graphql.default.request(query, { id, attributes })

    this.$db().model('Substitution').insertOrUpdate({ data: substitution })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeSubstitution($id: ID!) {
        removeSubstitution(id: $id) {
          substitution { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Substitution').delete(id)
  }
}
