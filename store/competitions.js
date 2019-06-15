import { crud } from '@/api'
import { Competition } from '@/models'

// actions
export const actions = crud({
  model: Competition,
  route: 'competitions',
  parentId: 'teamId',
  recordId: 'competitionId',
  dataName: 'competition'
})
