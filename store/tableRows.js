import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  CREATE ({ rootState }, { stageId, tableRow }) {
    return http({
      method: 'post',
      path: myfifa.tableRows.index,
      pathData: { stageId },
      token: rootState.token,
      data: { table_row: tableRow }
    })
  },
  UPDATE ({ rootState }, tableRow) {
    return http({
      method: 'patch',
      path: myfifa.tableRows.record,
      pathData: { rowId: tableRow.id },
      token: rootState.token,
      data: { table_row: tableRow }
    })
  },
  REMOVE ({ rootState }, rowId) {
    return http({
      method: 'delete',
      path: myfifa.tableRows.record,
      pathData: { rowId },
      token: rootState.token
    })
  }
}
