<template>
  <v-container>
    <v-row
      class="text-center"
      dense
    >
      <v-col
        cols="12"
        sm="6"
      >
        <season-team-growth
          label="Team Value"
          attribute="value"
          :formatter="$_formatMoney"
          :season-start="seasonStart"
          :season-end="seasonEnd"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <season-team-growth
          label="Team OVR"
          attribute="ovr"
          :formatter="parseInt"
          average
          :season-start="seasonStart"
          :season-end="seasonEnd"
        />
      </v-col>

      <v-col cols="12">
        <v-divider />
      </v-col>

      <v-col
        cols="4"
        sm="2"
      >
        <div class="display-1 success--text">{{ numWins }}</div>
        <div class="subheading">Wins</div>
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="display-1 warning--text">{{ numDraws }}</div>
        <div class="subheading">Draws</div>
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="display-1 red--text">{{ numLosses }}</div>
        <div class="subheading">Losses</div>
      </v-col>
      <v-col
        cols="6"
        sm="2"
      >
        <div class="display-1 teal--text">{{ numGoalsFor }}</div>
        <div class="subheading">Goals For</div>
      </v-col>
      <v-col
        cols="6"
        sm="2"
      >
        <div class="display-1 pink--text">{{ numGoalsAgainst }}</div>
        <div class="subheading">Goals Against</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { addYears } from 'date-fns'
  import { Match, Team } from '@/models'
  import SeasonTeamGrowth from './TeamGrowth'

  @Component({
    components: {
      SeasonTeamGrowth
    }
  })
  export default class SeasonSummary extends Vue {
    @Prop({ type: [String, Number], required: true }) season

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get seasonStart () {
      let date = this.$_parse(this.team.started_on)
      date = addYears(date, parseInt(this.season))
      return this.$_format(date)
    }

    get seasonEnd () {
      let date = this.$_parse(this.team.started_on)
      date = addYears(date, parseInt(this.season) + 1)
      return this.$_format(date)
    }

    get matches () {
      return Match
        .query()
        .where('team_id', this.team.id)
        .where('played_on', date => {
          return this.seasonStart <= date && date <= this.seasonEnd
        })
        .get()
    }

    get numWins () {
      return this.matches.filter(match => match.team_result === 'win').length
    }

    get numDraws () {
      return this.matches.filter(match => match.team_result === 'draw').length
    }

    get numLosses () {
      return this.matches.filter(match => match.team_result === 'loss').length
    }

    get numGoalsFor () {
      return this.$_sum(this.matches.map(match =>
        match.home === this.team.title ? match.home_score : match.away_score
      ))
    }

    get numGoalsAgainst () {
      return this.$_sum(this.matches.map(match =>
        match.home === this.team.title ? match.away_score : match.home_score
      ))
    }
  }
</script>
