import { gql } from 'nuxt-graphql-request'
import { loanFragment } from '~/fragments'

// actions
export const actions = {
  async create (_, { playerId, attributes }) {
    const query = gql`
      mutation createLoan($playerId: ID!, $attributes: LoanAttributes!) {
        addLoan(playerId: $playerId, attributes: $attributes) {
          loan { ...LoanData }
        }
      }
      ${loanFragment}
    `

    await this.$graphql.default.request(query, { playerId, attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: LoanAttributes!) {
        updateLoan(id: $id, attributes: $attributes) {
          loan { ...LoanData }
        }
      }
      ${loanFragment}
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeLoan($id: ID!) {
        removeLoan(id: $id) {
          loan { ...LoanData }
        }
      }
      ${loanFragment}
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Loan').delete(id)
  }
}
