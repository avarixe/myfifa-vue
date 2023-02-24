import { gql } from 'nuxt-graphql-request'
import { competitionFragment } from '@/fragments'

// actions
export const actions = {
  async fetch (_, { teamId, query }) {
    query = query || gql`
      query fetchCompetitions($teamId: ID!) {
        team(id: $teamId) {
          competitions { ...CompetitionData }
        }
      }
      ${competitionFragment}
    `

    const { team: { competitions } } =
      await this.$graphql.default.request(query, { teamId })
    this.$db().model('Competition').insertOrUpdate({ data: competitions })
  },
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createCompetition($teamId: ID!, $attributes: CompetitionAttributes!) {
        addCompetition(teamId: $teamId, attributes: $attributes) {
          competition { id }
        }
      }
    `

    const { addCompetition: { competition } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    this.$db().model('Competition').insert({ data: competition })
    return competition
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: CompetitionAttributes!) {
        updateCompetition(id: $id, attributes: $attributes) {
          competition { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeCompetition($id: ID!) {
        removeCompetition(id: $id) {
          competition { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Competition').delete(id)
  }
}
