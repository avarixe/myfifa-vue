import http from '@/api'
import myfifa from '@/api/myfifa'
import { crud } from '@/api/actions'
import { Substitution } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Substitution,
    route: 'substitutions',
    parentId: 'matchId',
    recordId: 'substitutionId',
    dataName: 'substitution'
  }),
  SEARCH ({ rootState }, { teamId }) {
    return http({
      method: 'post',
      path: myfifa.substitutions.search,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Substitution.insert({ data })
      }
    })
  }
}
