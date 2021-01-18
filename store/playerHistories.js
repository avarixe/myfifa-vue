import { PlayerHistory } from '@/models'

// actions
export const actions = {
  async SEARCH (_, { teamId }) {
    const data = await this.$axios.$post(
      `teams/${teamId}/player_histories/search`
    )
    PlayerHistory.insert({ data })
  }
}
