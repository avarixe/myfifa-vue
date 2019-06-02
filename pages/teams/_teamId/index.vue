<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Dashboard</div>
      </v-flex>
      <v-flex xs12>
        <team-date-picker />

        <team-form
          :team-id="team.id"
          color="orange"
        >
          <template #default="{ on }">
            <v-btn
              v-on="on"
              color="orange darken-2"
              outlined
              dark
            >Edit</v-btn>
          </template>
        </team-form>

        <match-form />
        <player-form />
        <team-remove :team="team" />
      </v-flex>

      <!-- Latest Match -->
      <v-flex xs12 md6>
        <match-card
          title="Latest Match"
          :match="lastMatch"
        />
      </v-flex>

      <!-- Current Season -->
      <v-flex xs12 md6>
        <season-item
          :season="season"
          color="green"
        />
      </v-flex>

      <!-- Injured Players -->
      <v-flex xs12 md4>
        <players-card
          :players="injuredPlayers"
          title="Injured Players"
          color="pink"
        />
      </v-flex>

      <!-- Loaned Players -->
      <v-flex xs12 md4>
        <players-card
          :players="loanedPlayers"
          title="Loaned Players"
          color="indigo"
        />
      </v-flex>

      <!-- Expiring Contracts -->
      <v-flex xs12 md4>
        <players-card
          :players="playersWithExpiringContracts"
          title="Expiring Contracts"
          color="orange"
        />
      </v-flex>

      <!-- Team Calendar -->
      <v-flex
        hidden-sm-and-down
        xs12
      >
        <material-card
          title="Calendar"
          color="blue"
        >
          <team-calendar />
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { Match, Player } from '@/models'
  import MatchForm from '@/components/Match/MatchForm'
  import PlayerForm from '@/components/Player/PlayerForm'
  import SeasonItem from '@/components/Season/SeasonItem'
  import TeamDatePicker from '@/components/Team/TeamDatePicker'
  import TeamForm from '@/components/Team/TeamForm'
  import TeamRemove from '@/components/Team/TeamRemove'
  import TeamCalendar from '@/components/Team/Dashboard/TeamCalendar'
  import MatchCard from '@/components/Team/Dashboard/MatchCard'
  import PlayersCard from '@/components/Team/Dashboard/PlayersCard'
  import MaterialCard from '@/helpers/theme/Card'
  import { TeamAccessible } from '@/mixins'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    components: {
      MatchForm,
      MatchCard,
      PlayerForm,
      PlayersCard,
      SeasonItem,
      TeamDatePicker,
      TeamForm,
      TeamRemove,
      TeamCalendar,
      MaterialCard
    },
    mixins: [
      TeamAccessible
    ],
    head () {
      return {
        title: this.team.title
      }
    },
    computed: {
      lastMatch () {
        return Match
          .query()
          .with('team')
          .where('team_id', this.team.id)
          .orderBy('date_played', 'desc')
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
          .with('contracts|team')
          .where('team_id', this.team.id)
          .get()
          .filter(player => player.contract.end_date <= this.seasonEnd)
      }
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    },
    methods: {
      getPlayersByStatus (status) {
        return Player
          .query()
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
