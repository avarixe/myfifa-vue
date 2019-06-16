import { crud } from '@/api'
import { TableRow } from '@/models'

// actions
export const actions = crud({
  model: TableRow,
  parent: 'stage'
})
