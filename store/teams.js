import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async fetch () {
    const { teams } = await this.$graphql.default.request(gql`
      query fetchTeams {
        teams {
          id
          name
          startedOn
          currentlyOn
          currency
          badgePath
        }
      }
    `)
    this.$db().model('Team').insert({ data: teams })
  },
  async get (_, { teamId }) {
    const query = gql`
      query fetchTeam($teamId: ID!) {
        team(id: $teamId) {
          id
          name
          startedOn
          currentlyOn
          currency
          badgePath
        }
      }
    `

    const { team } = await this.$graphql.default.request(query, { teamId })
    this.$db().model('Team').insert({ data: team })
  },
  async create (_, attributes) {
    const query = gql`
      mutation createTeam($attributes: TeamAttributes!) {
        addTeam(attributes: $attributes) {
          team {
            id
            name
            currency
            startedOn
            currentlyOn
          }
          errors {
            fullMessages
          }
        }
      }
    `

    const { addTeam: { errors, team } } =
      await this.$graphql.default.request(query, { attributes })

    if (team) {
      this.$db().model('Team').insert({ data: team })
      return team
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: TeamAttributes!) {
        updateTeam(id: $id, attributes: $attributes) {
          team {
            id
            name
            currency
          }
          errors {
            fullMessages
          }
        }
      }
    `

    const { updateTeam: { errors, team } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (team) {
      this.$db().model('Team').update({ data: team })
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, teamId) {
    const query = gql`
      mutation removeTeam($id: ID!) {
        removeTeam(id: $id) {
          errors {
            fullMessages
          }
        }
      }
    `

    const { removeTeam: { errors } } =
      await this.$graphql.default.request(query, { id: teamId })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Team').delete(teamId)
    }
  },
  analyzeSeason (_, { teamId, season }) {
    return this.$axios.$post(`teams/${teamId}/analyze/season/${season}`)
  }
}
