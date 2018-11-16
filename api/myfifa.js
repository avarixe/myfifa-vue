const domain = 'api.myfifa.joondev.com'

export const baseURL = process.env.NODE_ENV === 'production'
  ? `https://${domain}`
  : `http://${domain}:3000`

export const cableURL = process.env.NODE_ENV === 'production'
  ? `wss://${domain}/cable`
  : `ws://${domain}:3000/cable`

export default {
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

  transfers: {
    index: 'players/{{ playerId }}/transfers',
    record: 'transfers/{{ transferId }}'
  },

  contracts: {
    index: 'players/{{ playerId }}/contracts',
    record: 'contracts/{{ contractId }}'
  },

  injuries: {
    index: 'players/{{ playerId }}/injuries',
    record: 'injuries/{{ injuryId }}'
  },

  loans: {
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
    events: 'matches/{{ matchId }}/events',
    applySquad: 'matches/{{ matchId }}/apply_squad',
    penaltyShootout: 'matches/{{ matchId }}/penalty_shootout'
  },

  goals: {
    index: 'matches/{{ matchId }}/goals',
    record: 'goals/{{ goalId }}'
  },

  substitutions: {
    index: 'matches/{{ matchId }}/substitutions',
    record: 'substitutions/{{ substitutionId }}'
  },

  bookings: {
    index: 'matches/{{ matchId }}/bookings',
    record: 'bookings/{{ bookingId }}'
  },

  penaltyShootouts: {
    index: 'matches/{{ matchId }}/penalty_shootouts',
    record: 'penalty_shootouts/{{ penaltyShootoutId }}'
  },

  performances: {
    index: 'matches/{{ matchId }}/performances',
    record: 'performances/{{ performanceId }}'
  },

  competitions: {
    index: 'teams/{{ teamId }}/competitions',
    record: 'competitions/{{ competitionId }}'
  },

  stages: {
    index: 'competitions/{{ competitionId }}/stages',
    record: 'stages/{{ stageId }}'
  },

  tableRows: {
    index: 'stages/{{ stageId }}/table_rows',
    record: 'table_rows/{{ rowId }}'
  },

  fixtures: {
    index: 'stages/{{ stageId }}/fixtures',
    record: 'fixtures/{{ fixtureId }}'
  },

  users: {
    index: 'users.json'
  },

  token: {
    get: 'oauth/token',
    revoke: 'oauth/revoke'
  }
}
