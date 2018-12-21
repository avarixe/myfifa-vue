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

import modules from './modules'

const database = new Database()

const {
  teams,
  competitions,
  players,
  stages,
  fixtures,
  tableRows,
  squads,
  matches,
  contracts,
  injuries,
  loans,
  transfers,
  bookings,
  caps,
  goals,
  penaltyShootout,
  substitutions
} = modules

database.register(Team, teams)
database.register(Competition, competitions)
database.register(Player, players)
database.register(Stage, stages)
database.register(Fixture, fixtures)
database.register(TableRow, tableRows)
database.register(Squad, squads)
database.register(Match, matches)
database.register(Contract, contracts)
database.register(Injury, injuries)
database.register(Loan, loans)
database.register(Transfer, transfers)
database.register(PlayerHistory)
database.register(Booking, bookings)
database.register(Cap, caps)
database.register(Goal, goals)
database.register(PenaltyShootout, penaltyShootout)
database.register(Substitution, substitutions)

export default database
