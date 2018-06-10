export default {
  teams: {
    all: 'teams',
    get: 'teams/{{ teamId }}'
  },
  user: 'users/sync',
  token: {
    get: 'oauth/token',
    revoke: 'oauth/revoke'
  }
}
