<script>
  import { toRef, computed } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'SeasonSummary',
    props: {
      competitionStats: { type: Array, required: true },
      teamDevelopmentStats: { type: Object, required: true }
    },
    setup (props) {
      const competitionStats = toRef(props, 'competitionStats')

      const numWins = computed(() =>
        competitionStats.value.reduce((total, stats) => total + stats.wins, 0)
      )
      const numDraws = computed(() =>
        competitionStats.value.reduce((total, stats) => total + stats.draws, 0)
      )
      const numLosses = computed(() =>
        competitionStats.value.reduce((total, stats) => total + stats.losses, 0)
      )
      const numGoalsFor = computed(() =>
        competitionStats.value.reduce((total, stats) => total + stats.goalsFor, 0)
      )
      const numGoalsAgainst = computed(() =>
        competitionStats.value.reduce((total, stats) => total + stats.goalsAgainst, 0)
      )

      const { team } = useTeam()

      return {
        team,
        numWins,
        numDraws,
        numLosses,
        numGoalsFor,
        numGoalsAgainst
      }
    }
  }
</script>

<template>
  <v-container>
    <v-row
      class="text-center"
      justify="space-around"
      dense
    >
      <v-col
        cols="12"
        sm="6"
      >
        <delta-statistic
          label="Team Value"
          :formatter="x => `${team.currency}${parseInt(x).toLocaleString()}`"
          :start-value="parseInt(teamDevelopmentStats.startValue)"
          :end-value="parseInt(teamDevelopmentStats.endValue)"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <delta-statistic
          label="Team OVR"
          :formatter="parseInt"
          average
          :start-value="teamDevelopmentStats.startOvr"
          :end-value="teamDevelopmentStats.endOvr"
        />
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="text-h4 success--text">{{ numWins }}</div>
        <div class="subheading">Wins</div>
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="text-h4 warning--text">{{ numDraws }}</div>
        <div class="subheading">Draws</div>
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="text-h4 red--text">{{ numLosses }}</div>
        <div class="subheading">Losses</div>
      </v-col>
      <v-col
        cols="6"
        sm="2"
      >
        <div class="text-h4 teal--text">{{ numGoalsFor }}</div>
        <div class="subheading">Goals For</div>
      </v-col>
      <v-col
        cols="6"
        sm="2"
      >
        <div class="text-h4 pink--text">{{ numGoalsAgainst }}</div>
        <div class="subheading">Goals Against</div>
      </v-col>
    </v-row>
  </v-container>
</template>
