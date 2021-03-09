// actions
export const actions = {
  async search (_, { teamId }) {
    const data = await this.$axios.$post(
      `teams/${teamId}/player_histories/search`
    )
    this.$db().model('PlayerHistory').insert({ data })
  }
}
