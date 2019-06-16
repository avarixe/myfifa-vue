import { crud } from '@/api'
import { Squad } from '@/models'

// actions
export const actions = crud({
  model: Squad,
  parentId: 'teamId',
  dataName: 'squad'
})
