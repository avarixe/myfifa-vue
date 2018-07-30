export default {

  teams: {
    index: 'teams',
    record: 'teams/{{ teamId }}'
  },

  players: {
    index: 'teams/{{ teamId }}/players',
    update_multiple: 'teams/{{ teamId }}/players/update_multiple',
    record: 'players/{{ playerId }}',
    active_injury: 'players/{{ playerId }}/active_injury',
    active_loan: 'players/{{ playerId }}/active_loan'
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

  matchLogs: {
    index: 'matches//{{ matchId }}/logs',
    record: 'logs/{{ logId }}'
  },

  user: 'users/sync',

  token: {
    get: 'oauth/token',
    revoke: 'oauth/revoke'
  }
}
