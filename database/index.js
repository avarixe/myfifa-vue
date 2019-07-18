import { Database } from '@vuex-orm/core'

import {
  Booking,
  Cap,
  Competition,
  Contract,
  Fixture,
  Goal,
  Injury,
  Loan,
  Match,
  PenaltyShootout,
  Player,
  PlayerHistory,
  Squad,
  SquadPlayer,
  Stage,
  Substitution,
  TableRow,
  Team,
  Transfer
} from '@/models'

const database = new Database()

database.register(Booking, {})
database.register(Cap, {})
database.register(Competition, {})
database.register(Contract, {})
database.register(Fixture, {})
database.register(Goal, {})
database.register(Injury, {})
database.register(Loan, {})
database.register(Match, {})
database.register(PenaltyShootout, {})
database.register(Player, {})
database.register(PlayerHistory, {})
database.register(Squad, {})
database.register(SquadPlayer, {})
database.register(Stage, {})
database.register(Substitution, {})
database.register(TableRow, {})
database.register(Team, {})
database.register(Transfer, {})

export default database
