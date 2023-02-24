import { gql } from 'nuxt-graphql-request'
import { capFragment } from '@/fragments'

// state
export const state = () => ({
  teamOptions: []
})

// mutations
export const mutations = {
  setTeamOptions (state, teamOptions) {
    state.teamOptions = teamOptions
  }
}

// actions
export const actions = {
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createMatch($teamId: ID!, $attributes: MatchAttributes!) {
        addMatch(teamId: $teamId, attributes: $attributes) {
          match { id }
        }
      }
    `

    const { addMatch: { match } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    this.$db().model('Match').insert({ data: match })
    return match
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: MatchAttributes!) {
        updateMatch(id: $id, attributes: $attributes) {
          match { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeMatch($id: ID!) {
        removeMatch(id: $id) {
          match { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Match').delete(id)
  },
  async applySquad (_, { matchId, squadId }) {
    const query = gql`
      mutation applySquadToMatch($matchId: ID!, $squadId: ID!) {
        applySquadToMatch(matchId: $matchId, squadId: $squadId) {
          match {
            id
            caps { ...CapData }
          }
        }
      }
      ${capFragment}
    `

    const { applySquadToMatch: { match } } =
      await this.$graphql.default.request(query, { matchId, squadId })

    if (match) {
      this.$db().model('Match').insertOrUpdate({ data: match })
    }
  }
}
