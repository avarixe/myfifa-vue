import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
const actions = {
  UPDATE ({ rootState }, tableRow) {
    return http({
      method: 'patch',
      path: myfifa.tableRows.record,
      pathData: { rowId: tableRow.id },
      token: rootState.session.token,
      data: { table_row: tableRow }
    })
  }
}

export default {
  namespaced: true,
  actions
}
