import { crud } from '@/api/actions'
import { Fixture } from '@/models'

// actions
export const actions = crud({
  model: Fixture,
  route: 'fixtures',
  parentId: 'stageId',
  recordId: 'fixtureId',
  dataName: 'fixture'
})
