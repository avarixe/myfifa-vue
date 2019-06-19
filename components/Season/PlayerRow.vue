<template>
  <tr>
    <td class="text-xs-left">
      <v-btn
        :to="playerLink"
        nuxt
        text
        color="info"
      >{{ player.name }}</v-btn>
    </td>
    <td class="text-xs-center">{{ player.pos }}</td>
    <td class="text-xs-center">{{ player.age }}</td>

    <!-- Growth -->
    <template v-if="mode === 0">
      <td class="text-xs-center">{{ player.endOvr }}</td>
      <td :class="`text-xs-right ${ovrColor}`">
        {{ player.ovrChange > 0 ? '+' : '' }}{{ player.ovrChange }}
      </td>
      <td class="text-xs-right">{{ $_formatMoney(player.endValue) }}</td>
      <td :class="`text-xs-right ${valueColor}`">
        {{ player.valueChange.toFixed(2) }}%
      </td>
    </template>

    <!-- Statistics -->
    <template v-else-if="mode === 1">
      <td class="text-xs-right">{{ gamesView || '-' }}</td>
      <td class="text-xs-right">{{ goalsView || '-' }}</td>
      <td class="text-xs-right">{{ assistsView || '-' }}</td>
      <td class="text-xs-right">{{ csView || '-' }}</td>
    </template>
  </tr>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Team } from '@/models'

  @Component
  export default class SeasonPlayerRow extends Vue {
    @Prop({ type: [String, Number], required: true }) season
    @Prop({ type: Object, required: true }) player
    @Prop({ type: [String, Number], required: true }) mode

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get numGoalsPer90 () {
      return (this.player.numGoals / this.player.numMinutes * 90).toFixed(2)
    }

    get numAssistsPer90 () {
      return (this.player.numAssists / this.player.numMinutes * 90).toFixed(2)
    }

    get csPercentage () {
      return (this.player.numCs / this.player.numGames * 100).toFixed(2)
    }

    get gamesView () {
      return this.player.numGames > 0 &&
        `${this.player.numGames} (${this.player.numSubs})`
    }

    get goalsView () {
      return this.player.numGoals > 0 &&
        `${this.player.numGoals} (${this.numGoalsPer90})`
    }

    get assistsView () {
      return this.player.numAssists > 0 &&
        `${this.player.numAssists} (${this.numAssistsPer90})`
    }

    get csView () {
      return this.player.numCs > 0 &&
        `${this.player.numCs} (${this.csPercentage}%)`
    }

    get ovrColor () {
      switch (true) {
        case this.player.ovrChange > 6:
          return 'green--text text--darken-2'
        case this.player.ovrChange > 4:
          return 'green--text'
        case this.player.ovrChange > 2:
          return 'light-green--text text--darken-2'
        case this.player.ovrChange > 0:
          return 'light-green--text'
        case this.player.ovrChange < -2:
          return 'red--text'
        case this.player.ovrChange < 0:
          return 'orange--text'
        default:
          return 'grey--text'
      }
    }

    get valueColor () {
      switch (true) {
        case this.player.valueChange > 100:
          return 'green--text text--darken-2'
        case this.player.valueChange > 50:
          return 'green--text'
        case this.player.valueChange > 25:
          return 'light-green--text text--darken-2'
        case this.player.valueChange > 0:
          return 'light-green--text'
        case this.player.valueChange < -25:
          return 'red--text'
        case this.player.valueChange < 0:
          return 'orange--text'
        default:
          return 'grey--text'
      }
    }

    get playerLink () {
      return {
        name: 'teams-teamId-players-playerId',
        params: {
          teamId: this.$route.params.teamId,
          playerId: this.player.id
        }
      }
    }
  }
</script>
