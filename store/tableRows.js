import { crud } from '@/api'
import { TableRow } from '@/models'

// actions
export const actions = crud({
  model: TableRow,
  route: 'tableRows',
  parentId: 'stageId',
  recordId: 'rowId',
  dataName: 'table_row'
})
