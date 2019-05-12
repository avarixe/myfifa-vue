import { Database } from '@vuex-orm/core'

import {
  Team,
  Competition,
  Player,
  Stage,
  Fixture,
  TableRow,
  Squad,
  Match,
  Contract,
  Injury,
  Loan,
  Transfer,
  PlayerHistory,
  Booking,
  Cap,
  Goal,
  PenaltyShootout,
  Substitution
} from '@/models'

const database = new Database()

database.register(Team, {})
database.register(Competition, {})
database.register(Player, {})
database.register(Stage, {})
database.register(Fixture, {})
database.register(TableRow, {})
database.register(Squad, {})
database.register(Match, {})
database.register(Contract, {})
database.register(Injury, {})
database.register(Loan, {})
database.register(Transfer, {})
database.register(PlayerHistory, {})
database.register(Booking, {})
database.register(Cap, {})
database.register(Goal, {})
database.register(PenaltyShootout, {})
database.register(Substitution, {})

export default database
