import { Squad, SquadPlayer } from '@/models'

// actions
export const actions = {
  async FETCH (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/squads`)
    Squad.insert({ data })
  },
  async CREATE (_, { teamId, squad }) {
    const data = await this.$axios.$post(`teams/${teamId}/squads`, { squad })
    Squad.insert({ data })
  },
  async UPDATE (_, squad) {
    const data = await this.$axios.$patch(`squads/${squad.id}`, { squad })
    Squad.insert({ data })
  },
  async REMOVE (_, squadId) {
    await this.$axios.$delete(`squads/${squadId}`)
    Squad.delete(squadId)
  },
  async STORE_LINEUP (_, { matchId, squadId }) {
    const data = await this.$axios.$post(
      `squads/${squadId}/store_lineup/${matchId}`
    )
    SquadPlayer.delete(player => player.squad_id === squadId)
    Squad.insert({ data })
  }
}
