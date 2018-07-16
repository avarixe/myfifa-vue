export default {
  teams: {
    all: 'teams',
    get: 'teams/{{ teamId }}'
  },
  players: {
    all: 'teams/{{ teamId }}/players',
    get: 'players/{{ playerId }}',
    update_multiple: 'teams/{{ teamId }}/players/update_multiple'
  },
  transfers: {
    all: 'players/{{ playerId }}/transfers',
    get: 'transfers/{{ transferId }}'
  },
  contracts: {
    all: 'players/{{ playerId }}/contracts',
    get: 'contracts/{{ contractId }}'
  },
  injuries: {
    all: 'players/{{ playerId }}/injuries',
    get: 'injuries/{{ injuryId }}'
  },
  loans: {
    all: 'players/{{ playerId }}/loans',
    get: 'loans/{{ loanId }}'
  },

  squads: {
    all: 'teams/{{ teamId }}/squads',
    get: 'squads/{{ squadId }}'
  },

  matches: {
    all: 'teams/{{ teamId }}/matches',
    get: 'matches/{{ matchId }}'
  },
  matchLogs: {
    all: 'matches//{{ matchId }}/logs',
    get: 'logs/{{ logId }}'
  },

  user: 'users/sync',
  token: {
    get: 'oauth/token',
    revoke: 'oauth/revoke'
  }
}
