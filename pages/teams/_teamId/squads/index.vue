<template>
  <v-container>
    <v-row>
      <v-col>
        <squad-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { teamFragment, squadFragment, playerFragment } from '@/fragments'

  export default {
    name: 'SquadsPage',
    async fetch () {
      const query = gql`
        query fetchSquadsPage($teamId: ID!) {
          team(id: $teamId) {
            ...TeamData
            squads { ...SquadData }
            players { ...PlayerData }
          }
        }
        ${teamFragment}
        ${squadFragment}
        ${playerFragment}
      `

      const { team } = await this.$graphql.default.request(query, {
        teamId: this.teamId
      })

      await this.$store.$db().model('Team').insert({ data: team })

      this.setPage({
        title: `${team.name} - Squads`,
        headline: 'Squads'
      })
    },
    computed: {
      teamId () {
        return parseInt(this.$route.params.teamId)
      }
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
