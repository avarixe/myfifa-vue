<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="{ name: 'statistics-development', query: { teamId } }"
          nuxt
          color="teal"
          dark
        >
          <v-icon left>mdi-trending-up</v-icon>
          Development
        </v-btn>
        <v-btn
          :to="{ name: 'statistics-performances', query: { teamId } }"
          nuxt
          color="purple"
          dark
        >
          <v-icon left>mdi-numeric</v-icon>
          Performances
        </v-btn>
      </v-col>
      <v-col cols="12">
        <player-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { teamFragment, playerFragment, contractFragment } from '@/fragments'

  export default {
    name: 'PlayersPage',
    transition: 'fade-transition',
    async fetch () {
      const { teamId } = this.$route.query

      if (teamId) {
        const query = gql`
          query fetchPlayersPage($teamId: ID!) {
            team(id: $teamId) {
              ...TeamData
              players {
                ...PlayerData
                currentContract { ...ContractData }
              }
            }
          }
          ${teamFragment}
          ${playerFragment}
          ${contractFragment}
        `

        const { team } =
          await this.$graphql.default.request(query, { teamId: this.teamId })
        const contracts = team.players.map(player => player.currentContract)

        await Promise.all([
          this.$store.$db().model('Team').insert({ data: team }),
          this.$store.$db().model('Contract').insert({ data: contracts })
        ])

        this.setPage({
          title: `${team.name} - Players`,
          headline: 'Players'
        })
      } else {
        this.$router.push('/')
      }
    },
    computed: {
      teamId () {
        return parseInt(this.$route.query.teamId)
      }
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
