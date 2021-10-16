<script>
  import { computed, reactive, useContext, useFetch, useStore } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { useTeam } from '@/composables'
  import {
    teamFragment,
    matchFragment,
    competitionFragment
  } from '@/fragments'

  export default {
    name: 'TeamPage',
    setup () {
      const { teamId, team, currentSeason } = useTeam()

      const teamData = reactive({
        injuredPlayers: [],
        loanedPlayers: [],
        expiringPlayers: []
      })

      const { $graphql } = useContext()
      const store = useStore()
      useFetch(async () => {
        const query = gql`
          query loadDashboard($id: ID!) {
            team(id: $id) {
              ...TeamData
              lastMatch { ...MatchData }
              injuredPlayers {
                id
                name
                pos
                currentInjury {
                  description
                  startedOn
                  endedOn
                }
              }
              loanedPlayers {
                id
                name
                pos
                value
                currentLoan {
                  transferFee
                  addonClause
                }
              }
              expiringPlayers {
                id
                name
                pos
                value
                currentContract {
                  wage
                }
              }
              competitions { ...CompetitionData }
            }
          }
          ${teamFragment}
          ${matchFragment}
          ${competitionFragment}
        `

        const { team: teamRes } =
          await $graphql.default.request(query, { id: parseInt(teamId.value) })

        await store.$db().model('Team').insert({ data: teamRes })
        if (teamRes.lastMatch) {
          await store.$db().model('Match').insert({ data: teamRes.lastMatch })
        }

        store.commit('app/setPage', {
          title: team.value.name,
          headline: 'Dashboard'
        })

        teamData.injuredPlayers = teamRes.injuredPlayers
        teamData.loanedPlayers = teamRes.loanedPlayers
        teamData.expiringPlayers = teamRes.expiringPlayers
      })

      return {
        team,
        teamId,
        currentSeason,
        teamData,
        lastMatch: computed(() => {
          return store.$db().model('Match')
            .query()
            .where('teamId', teamId)
            .orderBy('playedOn', 'desc')
            .first()
        })
      }
    }
  }
</script>

<template>
  <v-container>
    <v-row v-if="team">
      <v-col cols="12">
        <team-form
          :record="team"
          color="orange"
        >
          <template #activator="{ on }">
            <v-btn
              color="orange"
              dark
              class="mb-1"
              v-on="on"
            >
              Edit
            </v-btn>
          </template>
        </team-form>
        <v-btn
          class="mb-1"
          :to="`/teams/${teamId}/players/import`"
          nuxt
          color="primary"
          dark
        >
          Import Players
        </v-btn>
        <record-remove
          :record="team"
          store="teams"
          :label="team.name"
          :redirect="{ name: 'teams' }"
        >
          <template #activator="{ on }">
            <v-btn
              dark
              class="mb-1"
              v-on="on"
            >
              Remove
            </v-btn>
          </template>
        </record-remove>
      </v-col>
      <v-col
        class="pa-0"
        cols="12"
        md="6"
      >
        <!-- Latest Match -->
        <v-col cols="12">
          <match-card
            title="Latest Match"
            :match="lastMatch"
            color="green"
          />
        </v-col>
        <!-- Current Season -->
        <v-col cols="12">
          <season-card :season="currentSeason" />
        </v-col>
      </v-col>
      <v-col
        class="pa-0"
        cols="12"
        md="6"
      >
        <!-- Injured Players -->
        <v-col cols="12">
          <injury-list-card
            title="Injured Players"
            color="pink"
            :players="teamData.injuredPlayers"
          />
        </v-col>
        <!-- Loaned Players -->
        <v-col cols="12">
          <loan-list-card
            title="Loaned Players"
            color="deep-orange"
            :players="teamData.loanedPlayers"
          />
        </v-col>
        <!-- Expiring Contracts -->
        <v-col cols="12">
          <contract-list-card
            title="Expiring Contracts"
            color="red darken-1"
            :players="teamData.expiringPlayers"
          />
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .v-item--active {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
