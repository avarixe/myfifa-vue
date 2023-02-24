import { gql } from 'nuxt-graphql-request'
import { teamFragment } from '@/fragments'

// actions
export const actions = {
  async create (_, attributes) {
    const query = gql`
      mutation createTeam($attributes: TeamAttributes!) {
        addTeam(attributes: $attributes) {
          team { ...TeamData }
        }
      }
      ${teamFragment}
    `

    const { addTeam: { team } } =
      await this.$graphql.default.request(query, { attributes })

    this.$db().model('Team').insert({ data: team })
    return team
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: TeamAttributes!) {
        updateTeam(id: $id, attributes: $attributes) {
          team { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, teamId) {
    const query = gql`
      mutation removeTeam($id: ID!) {
        removeTeam(id: $id) {
          team { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id: teamId })

    this.$db().model('Team').delete(teamId)
  }
}
