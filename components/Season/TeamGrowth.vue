<template lang="pug">
  delta-statistic(
    :label="label"
    :formatter="formatter"
    :start-value="startValue"
    :end-value="endValue"
  )
</template>

<script>
  import { Player, Contract, Team } from '@/models'
  import { sum } from '@/functions'

  export default {
    name: 'SeasonTeamGrowth',
    props: {
      attribute: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      average: {
        type: Boolean,
        default: false
      },
      formatter: {
        type: Function,
        default: x => x
      },
      seasonStart: {
        type: String,
        default: null
      },
      seasonEnd: {
        type: String,
        default: null
      }
    },
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      },
      contractsAtStart () {
        return Contract
          .query()
          .where(contract =>
            contract.started_on <= this.seasonStart &&
            this.seasonStart < contract.ended_on
          )
          .get()
      },
      playersAtStart () {
        return Player
          .query()
          .with('histories')
          .where('team_id', this.team.id)
          .whereIdIn(this.contractsAtStart.map(contract => contract.player_id))
          .get()
      },
      contractsAtEnd () {
        return Contract
          .query()
          .where(contract =>
            contract.started_on <= this.seasonEnd &&
            this.seasonEnd < contract.ended_on
          )
          .get()
      },
      playersAtEnd () {
        return Player
          .query()
          .with('histories')
          .where('team_id', this.team.id)
          .whereIdIn(this.contractsAtEnd.map(contract => contract.player_id))
          .get()
      },
      startValue () {
        const total = sum(
          this.playersAtStart.map(player =>
            player.recordAt(this.seasonStart)[this.attribute]
          )
        )
        return this.average ? total / this.playersAtStart.length : total
      },
      endValue () {
        const total = sum(
          this.playersAtEnd.map(player =>
            player.recordAt(this.seasonEnd)[this.attribute]
          )
        )
        return this.average ? total / this.playersAtEnd.length : total
      },
      color () {
        return this.startValue < this.endValue ? 'green' : 'red'
      },
      icon () {
        return this.startValue < this.endValue ? 'menu-up' : 'menu-down'
      },
      percentage () {
        return Math.abs((this.endValue - this.startValue) / this.startValue) * 100
      }
    }
  }
</script>
