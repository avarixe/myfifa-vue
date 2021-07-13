import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async fetch (_, { teamId }) {
    const query = gql`
      query fetchSquads($teamId: ID!) {
        team(id: $teamId) {
          squads {
            id
            teamId
            name
            squadPlayers {
              id
              squadId
              playerId
              pos
              player {
                id
                teamId
                name
                pos
              }
            }
          }
        }
      }
    `

    const { team: { squads } } =
      await this.$graphql.default.request(query, { teamId })
    this.$db().model('Squad').insertOrUpdate({ data: squads })
  },
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createSquad($teamId: ID!, $attributes: SquadAttributes!) {
        addSquad(teamId: $teamId, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { addSquad: { errors } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: SquadAttributes!) {
        updateSquad(id: $id, attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { updateSquad: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeSquad($id: ID!) {
        removeSquad(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeSquad: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Squad').delete(id)
    }
  },
  async storeLineup (_, { matchId, squadId }) {
    const query = gql`
      mutation storeMatchLineupToSquad($matchId: ID!, $squadId: ID!) {
        storeMatchLineupToSquad(matchId: $matchId, squadId: $squadId) {
          squad { id }
        }
      }
    `

    const { storeMatchLineupToSquad: { squad } } =
      await this.$graphql.default.request(query, { matchId, squadId })

    if (squad) {
      this.$db().model('SquadPlayer').delete(
        squadPlayer => squadPlayer.squadId === squadId
      )
    }
  }
}
