import { crud, http, routes } from '@/api'
import { Cap } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Cap,
    parent: 'match'
  }),
  SEARCH ({ rootState }, { teamId, filters }) {
    return http({
      method: 'post',
      path: routes.caps.search,
      pathData: { teamId },
      data: { filters },
      token: rootState.token,
      success ({ data }) {
        Cap.insert({ data })
      }
    })
  }
}
