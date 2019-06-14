import http from '@/api'
import myfifa from '@/api/myfifa'
import { crud } from '@/api/actions'
import { Cap } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Cap,
    route: 'caps',
    parentId: 'matchId',
    recordId: 'capId',
    dataName: 'cap'
  }),
  SEARCH ({ rootState }, { teamId }) {
    return http({
      method: 'post',
      path: myfifa.caps.search,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Cap.insert({ data })
      }
    })
  }
}
