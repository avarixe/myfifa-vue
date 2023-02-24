import { gql } from 'nuxt-graphql-request'
import { squadFragment } from '@/fragments'

// actions
export const actions = {
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createSquad($teamId: ID!, $attributes: SquadAttributes!) {
        addSquad(teamId: $teamId, attributes: $attributes) {
          squad { ...SquadData }
        }
      }
      ${squadFragment}
    `

    const { addSquad: { squad } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    this.$db().model('Squad').insertOrUpdate({ data: squad })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: SquadAttributes!) {
        updateSquad(id: $id, attributes: $attributes) {
          squad { ...SquadData }
        }
      }
      ${squadFragment}
    `

    const { updateSquad: { squad } } =
      await this.$graphql.default.request(query, { id, attributes })

    this.$db().model('Squad').insertOrUpdate({ data: squad })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeSquad($id: ID!) {
        removeSquad(id: $id) {
          squad { ...SquadData }
        }
      }
      ${squadFragment}
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Squad').delete(id)
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
