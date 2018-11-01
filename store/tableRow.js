import $_http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  update ({ commit, rootState }, payload) {
    return $_http({
      method: 'patch',
      path: myfifa.tableRows.record,
      pathData: { rowId: payload.id },
      token: rootState.token,
      data: { table_row: payload }
    })
  }
}
