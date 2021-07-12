import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async get (_, id) {
    const query = gql`
      mutation fetchPlayer($id: ID!) {
        player(id: $id) {
          id
          name
          nationality
          pos
          secPos
          ovr
          value
          status
          youth
          kitNo
          age
          posIdx
        }
      }
    `

    const { player } = await this.$graphql.default.request(query, { id })
    this.$db().model('Player').insertOrUpdate({ data: player })
  },
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createPlayer($teamId: ID!, $attributes: PlayerAttributes!) {
        addPlayer(teamId: $teamId, attributes: $attributes) {
          player { id }
          errors { fullMessages }
        }
      }
    `

    const { addPlayer: { errors, player } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    if (player) {
      this.$db().model('Team').insert({ data: player })
      return player
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: PlayerAttributes!) {
        updatePlayer(id: $id, attributes: $attributes) {
          player { id }
          errors { fullMessages }
        }
      }
    `

    const { updatePlayer: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removePlayer($id: ID!) {
        removePlayer(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removePlayer: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Player').delete(id)
    }
  },
  async retire (_, id) {
    const query = gql`
      mutation retirePlayer($id: ID!) {
        retirePlayer(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { retirePlayer: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async release (_, id) {
    const query = gql`
      mutation releasePlayer($id: ID!) {
        releasePlayer(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { releasePlayer: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  analyze (_, { teamId, playerIds }) {
    return this.$axios.$post(`teams/${teamId}/analyze/players`, {
      query: {
        player_ids: playerIds
      }
    })
  }
}
