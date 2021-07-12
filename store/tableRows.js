// actions
export const actions = {
  async create (_, { stageId, tableRow }) {
    const data = await this.$axios.$post(`stages/${stageId}/tableRows`, {
      table_row: tableRow
    })
    this.$db().model('TableRow').insert({ data })
  },
  async update (_, tableRow) {
    const data = await this.$axios.$patch(`tableRows/${tableRow.id}`, {
      table_row: tableRow
    })
    this.$db().model('TableRow').insert({ data })
  },
  async remove (_, tableRowId) {
    await this.$axios.$delete(`tableRows/${tableRowId}`)
    this.$db().model('TableRow').delete(tableRowId)
  }
}
