<template>
  <v-container
    v-if="team"
    fluid
  >
    <v-row>
      <v-col cols="12">
        <team-date-picker class="ma-1" />
        <team-form
          class="ma-1"
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
        <v-btn
          class="ma-1"
          :to="importPlayersLink"
          nuxt
          color="primary"
          dark
        >
          Import Players
        </v-btn>
        <record-remove
          class="ma-1"
          :record="team"
          store="teams"
          :label="team.title"
          :redirect="{ name: 'teams' }"
        >
          <v-btn dark>Remove</v-btn>
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
  import { Match, Player } from '@/models'
  import MatchCard from '@/components/Match/Card'
  import SeasonCard from '@/components/Season/Card'
  import TeamDatePicker from '@/components/Team/DatePicker'
  import TeamForm from '@/components/Team/Form'
  import PlayerListCard from '@/components/Player/ListCard'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'TeamPage',
    components: {
      MatchCard,
      PlayerListCard,
      SeasonCard,
      TeamDatePicker,
      TeamForm
    },
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    computed: {
      lastMatch () {
        return Match
          .query()
          .with('team')
          .where('team_id', this.team.id)
          .orderBy('played_on', 'desc')
          .first()
      },
      injuredPlayers () {
        return this.getPlayersByStatus('Injured')
      },
      loanedPlayers () {
        return this.getPlayersByStatus('Loaned')
      },
      playersWithExpiringContracts () {
        return Player
          .query()
          .with('team')
          .where('team_id', this.team.id)
          .get()
          .filter(player => player.contract().ended_on <= this.seasonEnd)
      },
      importPlayersLink () {
        return {
          name: 'teams-teamId-players-import',
          params: { teamId: this.team.id }
        }
      }
    },
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('matches/FETCH', { teamId: params.teamId }),
        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('competitions/FETCH', { teamId: params.teamId }),
        store.dispatch('contracts/SEARCH', { teamId: params.teamId })
      ])
    },
    mounted () {
      this.setPage({
        title: this.team.title,
        overline: this.team.title,
        headline: 'Dashboard'
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'SET_PAGE'
      }),
      getPlayersByStatus (status) {
        return Player
          .query()
          .with('team')
          .where('team_id', this.team.id)
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
