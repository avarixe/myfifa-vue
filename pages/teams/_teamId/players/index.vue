<template>
  <v-container>
    <v-row>
      <v-col>
        <player-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import { playerFragment } from '@/fragments'

  export default {
    name: 'PlayersPage',
    mixins: [
      TeamAccessible
    ],
    async fetch () {
      const query = gql`
        query fetchPlayersPage($teamId: ID!) {
          team(id: $teamId) {
            players { ...PlayerData }
          }
        }
        ${playerFragment}
      `

      const { team: { players } } =
        await this.$graphql.default.request(query, { teamId: this.team.id })

      await this.$store.$db().model('Player').insertOrUpdate({ data: players })

      this.setPage({
        title: `${this.team.name} - Players`,
        headline: 'Players'
      })
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
