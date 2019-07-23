<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout wrap>
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
              color="orange darken-2"
              outlined
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
          <v-btn outlined>Remove</v-btn>
        </record-remove>
      </v-flex>

      <v-flex xs12>
        <match-form />
        <player-form />
      </v-flex>

      <!-- Latest Match -->
      <v-flex
        xs12
        md6
      >
        <match-card
          title="Latest Match"
          :match="lastMatch"
          color="success"
        />
      </v-flex>

      <!-- Current Season -->
      <v-flex
        xs12
        md6
      >
        <season-card :season="season" />
      </v-flex>

      <!-- Injured Players -->
      <v-flex
        xs12
        md4
      >
        <player-list-card
          :players="injuredPlayers"
          title="Injured Players"
          color="pink"
          :attributes="[{ text: 'Injury', value: 'injury' }]"
        />
      </v-flex>

      <!-- Loaned Players -->
      <v-flex
        xs12
        md4
      >
        <player-list-card
          :players="loanedPlayers"
          title="Loaned Players"
          color="indigo"
          :attributes="[{ text: 'Loaned To', value: 'loanedTo' }]"
        />
      </v-flex>

      <!-- Expiring Contracts -->
      <v-flex
        xs12
        md4
      >
        <player-list-card
          :players="playersWithExpiringContracts"
          title="Expiring Contracts"
          color="orange"
          :attributes="[{ text: 'OVR', value: 'ovr' }]"
        />
      </v-flex>

      <!-- Team Calendar -->
      <v-flex
        hidden-sm-and-down
        xs12
      >
        <v-card outlined>
          <v-card-title :class="`subtitle-1 d-block text-xs-center`">
            <span class="blue--text font-weight-light">Calendar</span>
          </v-card-title>

          <v-divider class="mx-3" />

          <v-card-text>
            <team-calendar />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { Match, Player } from '@/models'
  import MatchForm from '@/components/Match/Form'
  import MatchCard from '@/components/Match/Card'
  import PlayerForm from '@/components/Player/Form'
  import SeasonCard from '@/components/Season/Card'
  import TeamDatePicker from '@/components/Team/DatePicker'
  import TeamForm from '@/components/Team/Form'
  import TeamCalendar from '@/components/Team/Calendar'
  import PlayerListCard from '@/components/Player/ListCard'
  import { RecordRemove } from '@/helpers'
  import { TeamAccessible } from '@/mixins'

  @Component({
    components: {
      MatchForm,
      MatchCard,
      PlayerForm,
      PlayerListCard,
      SeasonCard,
      TeamDatePicker,
      TeamForm,
      TeamCalendar,
      RecordRemove
    },
    transition: 'fade-transition'
  })
  export default class TeamPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'
    head () {
      return {
        title: this.team.title
      }
    }

    get lastMatch () {
      return Match
        .query()
        .with('team')
        .where('team_id', this.team.id)
        .orderBy('played_on', 'desc')
        .first()
    }

    get injuredPlayers () {
      return this.getPlayersByStatus('Injured').map(player => ({
        ...player,
        injury: player.injury()
      }))
    }

    get loanedPlayers () {
      return this.getPlayersByStatus('Loaned').map(player => ({
        ...player,
        loanedTo: player.loanedTo()
      }))
    }

    get playersWithExpiringContracts () {
      return Player
        .query()
        .with('team')
        .where('team_id', this.team.id)
        .get()
        .filter(player => player.contract().ended_on <= this.seasonEnd)
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
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
