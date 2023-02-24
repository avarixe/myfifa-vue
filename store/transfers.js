import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { playerId, attributes }) {
    const query = gql`
      mutation createTransfer($playerId: ID!, $attributes: TransferAttributes!) {
        addTransfer(playerId: $playerId, attributes: $attributes) {
          transfer { id }
        }
      }
    `

    await this.$graphql.default.request(query, { playerId, attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: TransferAttributes!) {
        updateTransfer(id: $id, attributes: $attributes) {
          transfer { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeTransfer($id: ID!) {
        removeTransfer(id: $id) {
          transfer { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Transfer').delete(id)
  }
}
