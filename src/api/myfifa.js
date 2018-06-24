export default {
  teams: {
    all: 'teams',
    get: 'teams/{{ teamId }}'
  },
  players: {
    all: 'teams/{{ teamId }}/players',
    get: 'players/{{ playerId }}'
  },
  contracts: {
    all: 'players/{{ playerId }}/contracts',
    get: 'contracts/{{ contractId }}'
  },
  user: 'users/sync',
  token: {
    get: 'oauth/token',
    revoke: 'oauth/revoke'
  }
}
