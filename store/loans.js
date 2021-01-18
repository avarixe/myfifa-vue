import { Loan } from '@/models'

// actions
export const actions = {
  async CREATE (_, { playerId, loan }) {
    const data = await this.$axios.$post(`players/${playerId}/loans`, {
      loan
    })
    Loan.insert({ data })
  },
  async UPDATE (_, loan) {
    const data = await this.$axios.$patch(`loans/${loan.id}`, {
      loan
    })
    Loan.insert({ data })
  },
  async REMOVE (_, loanId) {
    await this.$axios.$delete(`loans/${loanId}`)
    Loan.delete(loanId)
  }
}
