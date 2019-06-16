import { crud } from '@/api'
import { Fixture } from '@/models'

// actions
export const actions = crud({
  model: Fixture,
  parent: 'stage',
  dataName: 'fixture'
})
