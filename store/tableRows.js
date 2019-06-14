import { crud } from '@/api/actions'
import { TableRow } from '@/models'

// actions
export const actions = crud({
  model: TableRow,
  route: 'tableRows',
  parentId: 'stageId',
  recordId: 'rowId',
  dataName: 'table_row'
})
