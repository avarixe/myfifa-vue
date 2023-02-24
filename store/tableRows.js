import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { stageId, attributes }) {
    const query = gql`
      mutation createTableRow($stageId: ID!, $attributes: TableRowAttributes!) {
        addTableRow(stageId: $stageId, attributes: $attributes) {
          tableRow { id }
        }
      }
    `

    await this.$graphql.default.request(query, { stageId, attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: TableRowAttributes!) {
        updateTableRow(id: $id, attributes: $attributes) {
          tableRow { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeTableRow($id: ID!) {
        removeTableRow(id: $id) {
          tableRow { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('TableRow').delete(id)
  }
}
