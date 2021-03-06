import { Squad, SquadPlayer } from '@/models'

// actions
export const actions = {
  async fetch (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/squads`)
    Squad.insert({ data })
  },
  async create (_, { teamId, squad }) {
    const data = await this.$axios.$post(`teams/${teamId}/squads`, { squad })
    Squad.insert({ data })
  },
  async update (_, squad) {
    const data = await this.$axios.$patch(`squads/${squad.id}`, { squad })
    Squad.insert({ data })
  },
  async remove (_, squadId) {
    await this.$axios.$delete(`squads/${squadId}`)
    Squad.delete(squadId)
  },
  async storeLineup (_, { matchId, squadId }) {
    const data = await this.$axios.$post(
      `squads/${squadId}/store_lineup/${matchId}`
    )
    SquadPlayer.delete(player => player.squad_id === squadId)
    Squad.insert({ data })
  }
}
