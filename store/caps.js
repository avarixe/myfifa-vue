import { crud, http, routes } from '@/api'
import { Cap } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Cap,
    parent: 'match',
    dataName: 'cap'
  }),
  SEARCH ({ rootState }, { teamId }) {
    return http({
      method: 'post',
      path: routes.caps.search,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Cap.insert({ data })
      }
    })
  }
}
