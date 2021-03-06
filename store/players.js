import { Player } from '@/models'

// actions
export const actions = {
  async fetch (_, { teamId }) {
    const data = await this.$axios.$get(`teams/${teamId}/players`)
    Player.insert({ data })
  },
  async get (_, { playerId }) {
    const data = await this.$axios.$get(`players/${playerId}`)
    Player.insert({ data })
  },
  async create (_, { teamId, player }) {
    const data = await this.$axios.$post(`teams/${teamId}/players`, {
      player
    })
    Player.insert({ data })
    return data
  },
  async update (_, player) {
    const data = await this.$axios.$patch(`players/${player.id}`, { player })
    Player.insert({ data })
  },
  async remove (_, playerId) {
    await this.$axios.$delete(`players/${playerId}`)
    Player.delete(playerId)
  },
  retire (_, playerId) {
    return this.$axios.$post(`players/${playerId}/retire`)
  },
  release (_, playerId) {
    return this.$axios.$post(`players/${playerId}/release`)
  },
  analyze (_, { teamId, playerIds }) {
    return this.$axios.$post(`teams/${teamId}/analyze/players`, {
      query: {
        player_ids: playerIds
      }
    })
  }
}
