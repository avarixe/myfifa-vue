import { Loan } from '@/models'

// actions
export const actions = {
  async create (_, { playerId, loan }) {
    const data = await this.$axios.$post(`players/${playerId}/loans`, {
      loan
    })
    Loan.insert({ data })
  },
  async update (_, loan) {
    const data = await this.$axios.$patch(`loans/${loan.id}`, {
      loan
    })
    Loan.insert({ data })
  },
  async remove (_, loanId) {
    await this.$axios.$delete(`loans/${loanId}`)
    Loan.delete(loanId)
  }
}
