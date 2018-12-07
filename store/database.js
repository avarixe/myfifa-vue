import { Database } from '@vuex-orm/core'

import Team from '@/models/Team'

import teams from './modules/teams'

const database = new Database()

database.register(Team, teams)

export default database
