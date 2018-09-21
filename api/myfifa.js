const domain = 'api.myfifa.joondev.com'

export const baseURL = `https://${domain}`
export const cableURL = `ws://${domain}/cable`

// export const baseURL = `http://${domain}:3000`
// export const cableURL = `ws://${domain}:3000/cable`

export default {
  teams: {
    index: 'teams',
    record: 'teams/{{ teamId }}',
    statistics: 'teams/{{ teamId }}/statistics'
  },

  players: {
    index: 'teams/{{ teamId }}/players',
    update_multiple: 'teams/{{ teamId }}/players/update_multiple',
    record: 'players/{{ playerId }}',
    current_injury: 'players/{{ playerId }}/current_injury',
    current_loan: 'players/{{ playerId }}/current_loan'
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

  users: {
    index: 'users.json'
  },

  token: {
    get: 'oauth/token',
    revoke: 'oauth/revoke'
  }
}
