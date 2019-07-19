import { http, routes } from '@/api'
import { PlayerHistory } from '@/models'

// actions
export const actions = {
  SEARCH ({ rootState }, { teamId }) {
    return http({
      method: 'post',
      path: routes.playerHistories.search,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        PlayerHistory.insert({ data })
      }
    })
  }
}
