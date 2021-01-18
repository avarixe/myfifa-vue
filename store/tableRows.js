import { TableRow } from '@/models'

// actions
export const actions = {
  async CREATE (_, { stageId, tableRow }) {
    const data = await this.$axios.$post(`stages/${stageId}/table_rows`, {
      table_row: tableRow
    })
    TableRow.insert({ data })
  },
  async UPDATE (_, tableRow) {
    const data = await this.$axios.$patch(`table_rows/${tableRow.id}`, {
      table_row: tableRow
    })
    TableRow.insert({ data })
  },
  async REMOVE (_, tableRowId) {
    await this.$axios.$delete(`table_rows/${tableRowId}`)
    TableRow.delete(tableRowId)
  }
}
