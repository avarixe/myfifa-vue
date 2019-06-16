import { crud, http, routes } from '@/api'
import { Substitution } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Substitution,
    parentId: 'matchId',
    dataName: 'substitution'
  }),
  SEARCH ({ rootState }, { teamId }) {
    return http({
      method: 'post',
      path: routes.substitutions.search,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Substitution.insert({ data })
      }
    })
  }
}
