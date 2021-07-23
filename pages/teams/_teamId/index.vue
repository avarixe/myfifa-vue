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
              v-text="'Edit'"
            />
          </template>
        </team-form>
        <v-btn
          class="mb-1"
          :to="importPlayersLink"
          nuxt
          color="primary"
          dark
          v-text="'Import Players'"
        />
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
              v-text="'Remove'"
            />
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
          <player-list-card
            :players="injuredPlayers"
            title="Injured Players"
            color="pink"
          />
        </v-col>
        <!-- Loaned Players -->
        <v-col cols="12">
          <player-list-card
            :players="loanedPlayers"
            title="Loaned Players"
            color="indigo"
          />
        </v-col>
        <!-- Expiring Contracts -->
        <v-col cols="12">
          <player-list-card
            :players="playersWithExpiringContracts"
            title="Expiring Contracts"
            color="orange"
          />
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import {
    teamFragment,
    matchFragment,
    playerFragment,
    contractFragment,
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
          .with('team')
          .where('teamId', this.teamId)
          .orderBy('playedOn', 'desc')
          .first()
      },
      injuredPlayers () {
        return this.getPlayersByStatus('Injured')
      },
      loanedPlayers () {
        return this.getPlayersByStatus('Loaned')
      },
      playersWithExpiringContracts () {
        return this.$store.$db().model('Player')
          .query()
          .with('team')
          .where('teamId', this.teamId)
          .get()
          .filter(player => player.contract().endedOn <= this.seasonEnd)
      },
      importPlayersLink () {
        return {
          name: 'teams-teamId-players-import',
          params: { teamId: this.teamId }
        }
      }
    },
    async fetch () {
      const query = gql`
        query loadDashboard($id: ID!) {
          team(id: $id) {
            ...TeamData
            lastMatch { ...MatchData }
            players {
              ...PlayerData
              currentContract { ...ContractData }
            }
            competitions { ...CompetitionData }
          }
        }
        ${teamFragment}
        ${matchFragment}
        ${playerFragment}
        ${contractFragment}
        ${competitionFragment}
      `

      const { team } =
        await this.$graphql.default.request(query, { id: this.teamId })
      const contracts = team.players.map(player => player.currentContract)

      await Promise.all([
        this.$store.$db().model('Team').insert({ data: team }),
        this.$store.$db().model('Match').insert({ data: team.lastMatch }),
        this.$store.$db().model('Contract').insert({ data: contracts })
      ])

      this.setPage({
        title: team.name,
        headline: 'Dashboard'
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      getPlayersByStatus (status) {
        return this.$store.$db().model('Player')
          .query()
          .with('team')
          .where('teamId', this.teamId)
          .where('status', status)
          .get()
      }
    }
  }
</script>

<style scoped>
  .v-item--active {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
