import { gql } from 'nuxt-graphql-request'
import { contractFragment } from '~/fragments'

// actions
export const actions = {
  async create (_, { playerId, attributes }) {
    const query = gql`
      mutation createContract($playerId: ID!, $attributes: ContractAttributes!) {
        addContract(playerId: $playerId, attributes: $attributes) {
          contract { ...ContractData }
        }
      }
      ${contractFragment}
    `

    await this.$graphql.default.request(query, { playerId, attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: ContractAttributes!) {
        updateContract(id: $id, attributes: $attributes) {
          contract { ...ContractData }
        }
      }
      ${contractFragment}
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeContract($id: ID!) {
        removeContract(id: $id) {
          contract { ...ContractData }
        }
      }
      ${contractFragment}
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Contract').delete(id)
  }
}
