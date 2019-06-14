import { crud } from '@/api/actions'
import { Competition } from '@/models'

// actions
export const actions = crud({
  model: Competition,
  route: 'competitions',
  parentId: 'teamId',
  recordId: 'competitionId',
  dataName: 'competition'
})
