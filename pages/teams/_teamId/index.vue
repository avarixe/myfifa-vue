<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <team-date-picker />

        <team-form
          :record="team"
          color="orange"
        >
          <template #default="{ on }">
            <v-btn
              color="orange"
              dark
              v-on="on"
            >
              Edit
            </v-btn>
          </template>
        </team-form>

        <record-remove
          :record="team"
          store="teams"
          :label="team.title"
          :redirect="{ name: 'teams' }"
        >
          <v-btn dark>Remove</v-btn>
        </record-remove>
      </v-col>

      <v-col
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
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import { Match, Player } from '@/models'
  import MatchCard from '@/components/Match/Card'
  import SeasonCard from '@/components/Season/Card'
  import TeamDatePicker from '@/components/Team/DatePicker'
  import TeamForm from '@/components/Team/Form'
  import PlayerListCard from '@/components/Player/ListCard'
  import { RecordRemove } from '@/helpers'
  import { TeamAccessible } from '@/mixins'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      MatchCard,
      PlayerListCard,
      SeasonCard,
      TeamDatePicker,
      TeamForm,
      RecordRemove
    },
    transition: 'fade-transition'
  })
  export default class TeamPage extends mixins(TeamAccessible) {
    @app.Mutation('SET_PAGE') setPage

    get lastMatch () {
      return Match
        .query()
        .with('team')
        .where('team_id', this.team.id)
        .orderBy('played_on', 'desc')
        .first()
    }

    get injuredPlayers () {
      return this.getPlayersByStatus('Injured')
    }

    get loanedPlayers () {
      return this.getPlayersByStatus('Loaned')
    }

    get playersWithExpiringContracts () {
      return Player
        .query()
        .with('team')
        .where('team_id', this.team.id)
        .get()
        .filter(player => player.contract().ended_on <= this.seasonEnd)
    }

    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('matches/FETCH', { teamId: params.teamId }),
        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('competitions/FETCH', { teamId: params.teamId }),
        store.dispatch('contracts/SEARCH', { teamId: params.teamId })
      ])
    }

    beforeMount () {
      this.setPage({
        title: this.team.title,
        overline: this.team.title,
        headline: 'Dashboard'
      })
    }

    getPlayersByStatus (status) {
      return Player
        .query()
        .with('team')
        .where('team_id', this.team.id)
        .where('status', status)
        .get()
    }
  }
</script>

<style scoped>
  .v-item--active {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
