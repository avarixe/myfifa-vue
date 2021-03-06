import { TableRow } from '@/models'

// actions
export const actions = {
  async create (_, { stageId, tableRow }) {
    const data = await this.$axios.$post(`stages/${stageId}/table_rows`, {
      table_row: tableRow
    })
    TableRow.insert({ data })
  },
  async update (_, tableRow) {
    const data = await this.$axios.$patch(`table_rows/${tableRow.id}`, {
      table_row: tableRow
    })
    TableRow.insert({ data })
  },
  async remove (_, tableRowId) {
    await this.$axios.$delete(`table_rows/${tableRowId}`)
    TableRow.delete(tableRowId)
  }
}
