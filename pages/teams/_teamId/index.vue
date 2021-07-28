<template>
  <v-container>
    <v-row v-if="team">
      <v-col cols="12">
        <team-form
          :record="team"
          color="orange"
        >
          <template #default="{ on }">
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
          <template #default="{ on }">
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
            :injuries="injuries"
          />
        </v-col>
        <!-- Loaned Players -->
        <v-col cols="12">
          <loan-list-card
            title="Loaned Players"
            color="indigo"
            :loans="loans"
          />
        </v-col>
        <!-- Expiring Contracts -->
        <v-col cols="12">
          <contract-list-card
            title="Expiring Contracts"
            color="warning"
            :contracts="expiringContracts"
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
    playerFragment,
    contractFragment,
    loanFragment,
    injuryFragment,
    competitionFragment
  } from '@/fragments'

  export default {
    name: 'TeamPage',
    mixins: [
      TeamAccessible
    ],
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
    async asyncData ({ $graphql, params, store }) {
      const query = gql`
        query loadDashboard($id: ID!) {
          team(id: $id) {
            ...TeamData
            lastMatch { ...MatchData }
            players {
              ...PlayerData
              currentContract { ...ContractData }
              currentLoan { ...LoanData }
              currentInjury { ...InjuryData }
            }
            competitions { ...CompetitionData }
          }
        }
        ${teamFragment}
        ${matchFragment}
        ${playerFragment}
        ${contractFragment}
        ${loanFragment}
        ${injuryFragment}
        ${competitionFragment}
      `

      const { team } =
        await $graphql.default.request(query, { id: parseInt(params.teamId) })
      const contracts = team.players
        .map(player => player.currentContract)
        .filter(contract => contract)
      const loans = team.players
        .map(player => player.currentLoan)
        .filter(loan => loan)
      const injuries = team.players
        .map(player => player.currentInjury)
        .filter(injury => injury)

      await Promise.all([
        store.$db().model('Team').insert({ data: team }),
        store.$db().model('Match').insert({ data: team.lastMatch })
      ])

      store.commit('app/setPage', {
        title: team.name,
        headline: 'Dashboard'
      })

      return {
        contracts,
        loans,
        injuries
      }
    }
  }
</script>

<style scoped>
  .v-item--active {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
