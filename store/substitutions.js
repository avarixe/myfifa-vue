import { Substitution } from '@/models'

// actions
export const actions = {
  async CREATE (_, { matchId, substitution }) {
    const data = await this.$axios.$post(`matches/${matchId}/substitutions`, {
      substitution
    })
    Substitution.insert({ data })
  },
  async UPDATE (_, substitution) {
    const data = await this.$axios.$patch(`substitutions/${substitution.id}`, {
      substitution
    })
    Substitution.insert({ data })
  },
  async REMOVE (_, substitutionId) {
    await this.$axios.$delete(`substitutions/${substitutionId}`)
    Substitution.delete(substitutionId)
  }
}
