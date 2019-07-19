const domain = 'myfifa-api.jhyuk.com'

export const baseURL = process.env.NODE_ENV === 'production'
  ? `https://${domain}`
  : `http://${domain}:3000`

export const cableURL = process.env.NODE_ENV === 'production'
  ? `wss://${domain}/cable`
  : `ws://${domain}:3000/cable`

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
    teamIndex: 'teams/{{ teamId }}/transfers',
    index: 'players/{{ playerId }}/transfers',
    record: 'transfers/{{ transferId }}'
  },

  contracts: {
    teamIndex: 'teams/{{ teamId }}/contracts',
    index: 'players/{{ playerId }}/contracts',
    record: 'contracts/{{ contractId }}'
  },

  injuries: {
    teamIndex: 'teams/{{ teamId }}/injuries',
    index: 'players/{{ playerId }}/injuries',
    record: 'injuries/{{ injuryId }}'
  },

  loans: {
    teamIndex: 'teams/{{ teamId }}/loans',
    index: 'players/{{ playerId }}/loans',
    record: 'loans/{{ loanId }}'
  },

  squads: {
    index: 'teams/{{ teamId }}/squads',
    record: 'squads/{{ squadId }}'
  },

  matches: {
    index: 'teams/{{ teamId }}/matches',
    record: 'matches/{{ matchId }}',
    applySquad: 'matches/{{ matchId }}/apply_squad',
    penaltyShootout: 'matches/{{ matchId }}/penalty_shootout'
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
    teamIndex: 'teams/{{ teamId }}/stages',
    index: 'competitions/{{ competitionId }}/stages',
    record: 'stages/{{ stageId }}'
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
