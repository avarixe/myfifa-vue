import { crud } from '@/api'
import { Competition } from '@/models'

// actions
export const actions = crud({
  model: Competition,
  parent: 'team'
})
