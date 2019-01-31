<template>
  <tr>
    <td
      class="text-xs-left"
      v-text="player.name"
    />
    <td
      class="text-xs-center"
      v-text="player.pos"
    />
    <td
      class="text-xs-center"
      v-text="player.age"
    />

    <!-- Growth -->
    <template
      v-if="mode === 0"
    >
      <td
        class="text-xs-center"
        v-text="endOvr"
      />
      <td
        :class="`text-xs-center ${ovrColor}`"
        v-text="`${ovrChange > 0 ? '+' : ''}${ovrChange}`"
      />
      <td
        class="text-xs-right"
        v-text="`${team.currency}${endValue.toLocaleString()}`"
      />
      <td
        :class="`text-xs-right ${valueColor}`"
        v-text="`${valueChange.toFixed(2)}%`"
      />
    </template>

    <!-- Statistics -->
    <template
      v-else-if="mode === 1"
    >
      <td
        class="text-xs-right"
        v-text="gamesView || '-'"
      />
      <td
        class="text-xs-right"
        v-text="goalsView || '-'"
      />
      <td
        class="text-xs-right"
        v-text="assistsView || '-'"
      />
      <td
        class="text-xs-right"
        v-text="csView || '-'"
      />
    </template>
  </tr>
</template>

<script>
  import {
    Team
  } from '@/models'

  export default {
    props: {
      season: {
        type: [String, Number],
        required: true
      },
      player: {
        type: Object,
        required: true
      },
      mode: {
        type: [String, Number],
        required: true
      }
    },
    computed: {
      team () { return Team.find(this.$route.params.teamId) },
      numGames () { return this.player.numGames },
      numSubs () { return this.player.numSubs },
      numGoals () { return this.player.numGoals },
      numAssists () { return this.player.numAssists },
      numMinutes () { return this.player.numMinutes },
      numCs () { return this.player.numCs },
      endOvr () { return this.player.endOvr },
      endValue () { return this.player.endValue },
      ovrChange () { return this.player.ovrChange },
      valueChange () { return this.player.valueChange },

      numGoalsPer90 () { return (this.numGoals / this.numMinutes * 90).toFixed(2) },
      numAssistsPer90 () { return (this.numAssists / this.numMinutes * 90).toFixed(2) },
      csPercentage () { return (this.numCs / this.numGames * 100).toFixed(2) },

      gamesView () { return this.numGames > 0 && `${this.numGames} (${this.numSubs})` },
      goalsView () { return this.numGoals > 0 && `${this.numGoals} (${this.numGoalsPer90})` },
      assistsView () { return this.numAssists > 0 && `${this.numAssists} (${this.numAssistsPer90})` },
      csView () { return this.numCs > 0 && `${this.numCs} (${this.csPercentage}%)` },

      ovrColor () {
        switch (true) {
          case this.ovrChange > 6: return 'green--text text--darken-2'
          case this.ovrChange > 4: return 'green--text'
          case this.ovrChange > 2: return 'light-green--text text--darken-2'
          case this.ovrChange > 0: return 'light-green--text'
          case this.ovrChange < -2: return 'red--text'
          case this.ovrChange < 0: return 'orange--text'
          default: return 'grey--text'
        }
      },
      valueColor () {
        switch (true) {
          case this.valueChange > 100: return 'green--text text--darken-2'
          case this.valueChange > 50: return 'green--text'
          case this.valueChange > 25: return 'light-green--text text--darken-2'
          case this.valueChange > 0: return 'light-green--text'
          case this.valueChange < -25: return 'red--text'
          case this.valueChange < 0: return 'orange--text'
          default: return 'grey--text'
        }
      }
    }
  }
</script>
