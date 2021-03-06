// actions
export const actions = {
  async fetch (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/squads`)
    this.$db().model('Squad').insert({ data })
  },
  async create (_, { teamId, squad }) {
    const data = await this.$axios.$post(`teams/${teamId}/squads`, { squad })
    this.$db().model('Squad').insert({ data })
  },
  async update (_, squad) {
    const data = await this.$axios.$patch(`squads/${squad.id}`, { squad })
    this.$db().model('Squad').insert({ data })
  },
  async remove (_, squadId) {
    await this.$axios.$delete(`squads/${squadId}`)
    this.$db().model('Squad').delete(squadId)
  },
  async storeLineup (_, { matchId, squadId }) {
    const data = await this.$axios.$post(
      `squads/${squadId}/store_lineup/${matchId}`
    )
    this.$db().model('SquadPlayer').delete(plyr => plyr.squad_id === squadId)
    this.$db().model('Squad').insert({ data })
  }
}
