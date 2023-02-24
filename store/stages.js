import { gql } from 'nuxt-graphql-request'
import { stageFragment } from '~/fragments'

// actions
export const actions = {
  async create (_, { competitionId, attributes }) {
    const query = gql`
      mutation createStage($competitionId: ID!, $attributes: StageAttributes!) {
        addStage(competitionId: $competitionId, attributes: $attributes) {
          stage { ...StageData }
        }
      }
      ${stageFragment}
    `

    await this.$graphql.default.request(query, { competitionId, attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: StageAttributes!) {
        updateStage(id: $id, attributes: $attributes) {
          stage { ...StageData }
        }
      }
      ${stageFragment}
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeStage($id: ID!) {
        removeStage(id: $id) {
          stage { ...StageData }
        }
      }
      ${stageFragment}
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Stage').delete(id)
  }
}
