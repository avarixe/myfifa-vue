import $_http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  update ({ commit, rootState }, tableRow) {
    return $_http({
      method: 'patch',
      path: myfifa.tableRows.record,
      pathData: { rowId: tableRow.id },
      token: rootState.token,
      data: { table_row: tableRow }
    })
  }
}
