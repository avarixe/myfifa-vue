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
  matches: {
    all: 'teams/{{ teamId }}/matches',
    get: 'matches/{{ matchId }}'
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
  user: 'users/sync',
  token: {
    get: 'oauth/token',
    revoke: 'oauth/revoke'
  }
}
