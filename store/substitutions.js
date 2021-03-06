// actions
export const actions = {
  async create (_, { matchId, substitution }) {
    const data = await this.$axios.$post(`matches/${matchId}/substitutions`, {
      substitution
    })
    this.$db().model('Substitution').insert({ data })
  },
  async update (_, substitution) {
    const data = await this.$axios.$patch(`substitutions/${substitution.id}`, {
      substitution
    })
    this.$db().model('Substitution').insert({ data })
  },
  async remove (_, substitutionId) {
    await this.$axios.$delete(`substitutions/${substitutionId}`)
    this.$db().model('Substitution').delete(substitutionId)
  }
}
