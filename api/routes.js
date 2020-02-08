export const baseURL = process.env.BASE_URL

export const cableURL = process.env.CABLE_URL

export const routes = {
  teams: {
    index: 'teams',
    record: 'teams/{{ teamId }}'
  },

  analyze: {
    players: 'teams/{{ teamId }}/analyze/players',
    season: 'teams/{{ teamId }}/analyze/season/{{ season }}'
  },

  players: {
    index: 'teams/{{ teamId }}/players',
    record: 'players/{{ playerId }}',
    history: 'players/{{ playerId }}/history',
    currentInjury: 'players/{{ playerId }}/current_injury',
    currentLoan: 'players/{{ playerId }}/current_loan',
    retire: 'players/{{ playerId }}/retire',
    release: 'players/{{ playerId }}/release'
  },

  playerHistories: {
    search: 'teams/{{ teamId }}/player_histories/search'
  },

  transfers: {
    index: 'players/{{ playerId }}/transfers',
    record: 'transfers/{{ transferId }}',
    search: 'teams/{{ teamId }}/transfers/search'
  },

  contracts: {
    index: 'players/{{ playerId }}/contracts',
    record: 'contracts/{{ contractId }}',
    search: 'teams/{{ teamId }}/contracts/search'
  },

  injuries: {
    index: 'players/{{ playerId }}/injuries',
    record: 'injuries/{{ injuryId }}',
    search: 'teams/{{ teamId }}/injuries/search'
  },

  loans: {
    index: 'players/{{ playerId }}/loans',
    record: 'loans/{{ loanId }}',
    search: 'teams/{{ teamId }}/loans/search'
  },

  squads: {
    index: 'teams/{{ teamId }}/squads',
    record: 'squads/{{ squadId }}',
    storeLineup: 'squads/{{ squadId }}/store_lineup/{{ matchId }}'
  },

  matches: {
    index: 'teams/{{ teamId }}/matches',
    record: 'matches/{{ matchId }}',
    applySquad: 'matches/{{ matchId }}/apply_squad/{{ squadId }}',
    penaltyShootout: 'matches/{{ matchId }}/penalty_shootout',
    teamOptions: 'teams/{{ teamId }}/matches/team_options'
  },

  goals: {
    index: 'matches/{{ matchId }}/goals',
    record: 'goals/{{ goalId }}',
    search: 'teams/{{ teamId }}/goals/search'
  },

  substitutions: {
    index: 'matches/{{ matchId }}/substitutions',
    record: 'substitutions/{{ substitutionId }}',
    search: 'teams/{{ teamId }}/substitutions/search'
  },

  bookings: {
    index: 'matches/{{ matchId }}/bookings',
    record: 'bookings/{{ bookingId }}',
    search: 'teams/{{ teamId }}/bookings/search'
  },

  caps: {
    index: 'matches/{{ matchId }}/caps',
    record: 'caps/{{ capId }}',
    search: 'teams/{{ teamId }}/caps/search'
  },

  competitions: {
    index: 'teams/{{ teamId }}/competitions',
    record: 'competitions/{{ competitionId }}'
  },

  stages: {
    index: 'competitions/{{ competitionId }}/stages',
    record: 'stages/{{ stageId }}',
    search: 'teams/{{ teamId }}/stages/search'
  },

  tableRows: {
    index: 'stages/{{ stageId }}/table_rows',
    record: 'table_rows/{{ tableRowId }}'
  },

  fixtures: {
    index: 'stages/{{ stageId }}/fixtures',
    record: 'fixtures/{{ fixtureId }}'
  },

  users: {
    record: 'users.json',
    sync: 'users/sync'
  },

  token: {
    get: 'oauth/token',
    revoke: 'oauth/revoke'
  }
}
