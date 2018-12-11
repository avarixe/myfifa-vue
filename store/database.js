import { Database } from '@vuex-orm/core'

import {
  Team,
  Competition,
  Player,
  Stage,
  Fixture,
  TableRow
} from '@/models'

import modules from './modules'

const database = new Database()

const {
  teams,
  competitions,
  players,
  stages,
  fixtures,
  tableRows
} = modules

console.log(stages)

database.register(Team, teams)
database.register(Competition, competitions)
database.register(Player, players)
database.register(Stage, stages)
database.register(Fixture, fixtures)
database.register(TableRow, tableRows)

export default database
