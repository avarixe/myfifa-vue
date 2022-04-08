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
          :to="{ name: 'players-import', query: { teamId } }"
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
          <season-card :season="season" />
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
            :players="injuredPlayers"
          />
        </v-col>
        <!-- Loaned Players -->
        <v-col cols="12">
          <loan-list-card
            title="Loaned Players"
            color="deep-orange"
            :players="loanedPlayers"
          />
        </v-col>
        <!-- Expiring Contracts -->
        <v-col cols="12">
          <contract-list-card
            title="Expiring Contracts"
            color="red darken-1"
            :players="expiringPlayers"
          />
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import {
    teamFragment,
    matchFragment,
    competitionFragment
  } from '@/fragments'

  export default {
    name: 'TeamPage',
    mixins: [
      TeamAccessible
    ],
    transition: 'fade-transition',
    async asyncData ({ $graphql, route, store, redirect }) {
      const { teamId } = route.query

      if (teamId) {
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

        const { team } =
          await $graphql.default.request(query, { id: parseInt(route.query.teamId) })
        const {
          injuredPlayers,
          loanedPlayers,
          expiringPlayers
        } = team

        await store.$db().model('Team').insert({ data: team })
        if (team.lastMatch) {
          await store.$db().model('Match').insert({ data: team.lastMatch })
        }

        store.commit('app/setPage', {
          title: team.name,
          headline: 'Dashboard'
        })

        return {
          injuredPlayers,
          loanedPlayers,
          expiringPlayers
        }
      } else {
        redirect('/')
      }
    },
    computed: {
      lastMatch () {
        return this.$store.$db().model('Match')
          .query()
          .where('teamId', this.teamId)
          .orderBy('playedOn', 'desc')
          .first()
      },
      expiringContracts () {
        return this.contracts.filter(contract => {
          return !contract.conclusion &&
            (!contract.endedOn || contract.endedOn <= this.seasonEnd)
        })
      }
    },
    watchQuery: ['teamId']
  }
</script>

<style scoped>
  .v-item--active {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
