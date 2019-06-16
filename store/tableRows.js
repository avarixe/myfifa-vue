import { crud } from '@/api'
import { TableRow } from '@/models'

// actions
export const actions = crud({
  model: TableRow,
  parentId: 'stageId',
  recordId: 'tableRowId',
  dataName: 'table_row'
})
