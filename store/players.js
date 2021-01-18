import { Player } from '@/models'

// actions
export const actions = {
  async FETCH (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/players`)
    Player.insert({ data })
  },
  async GET (_, { playerId }) {
    const data = await this.$axios.$get(`players/${playerId}`)
    Player.insert({ data })
  },
  async CREATE (_, { teamId, player }) {
    const data = await this.$axios.$post(`teams/${teamId}/players`, {
      player
    })
    Player.insert({ data })
    return data
  },
  async UPDATE (_, player) {
    const data = await this.$axios.$patch(`players/${player.id}`, { player })
    Player.insert({ data })
  },
  async REMOVE (_, playerId) {
    await this.$axios.$delete(`players/${playerId}`)
    Player.delete(playerId)
  },
  RETIRE (_, playerId) {
    return this.$axios.$post(`players/${playerId}/retire`)
  },
  RELEASE (_, playerId) {
    return this.$axios.$post(`players/${playerId}/release`)
  },
  ANALYZE (_, { teamId, playerIds }) {
    return this.$axios.$post(`teams/${teamId}/analyze/players`, {
      query: {
        player_ids: playerIds
      }
    })
  }
}
