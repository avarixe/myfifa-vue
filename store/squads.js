import { crud } from '@/api'
import { Squad } from '@/models'

// actions
export const actions = crud({
  model: Squad,
  route: 'squads',
  parentId: 'teamId',
  recordId: 'squadId',
  dataName: 'squad'
})
