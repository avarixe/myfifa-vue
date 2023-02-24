import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createPlayer($teamId: ID!, $attributes: PlayerAttributes!) {
        addPlayer(teamId: $teamId, attributes: $attributes) {
          player { id }
        }
      }
    `

    const { addPlayer: { player } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    this.$db().model('Player').insert({ data: player })
    return player
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: PlayerAttributes!) {
        updatePlayer(id: $id, attributes: $attributes) {
          player { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removePlayer($id: ID!) {
        removePlayer(id: $id) {
          player { id }
        }
      }
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Player').delete(id)
  },
  async retire (_, id) {
    const query = gql`
      mutation retirePlayer($id: ID!) {
        retirePlayer(id: $id) {
          player { id }
        }
      }
    `

    const { retirePlayer: { player } } =
      await this.$graphql.default.request(query, { id })

    if (!player) {
      throw new Error('Could not retire Player')
    }
  },
  async release (_, id) {
    const query = gql`
      mutation releasePlayer($id: ID!) {
        releasePlayer(id: $id) {
          player { id }
        }
      }
    `

    const { releasePlayer: { player } } =
      await this.$graphql.default.request(query, { id })

    if (!player) {
      throw new Error('Could not release Player')
    }
  }
}
