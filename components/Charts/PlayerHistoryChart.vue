<template lang="pug">
  area-chart(
    :data="chartData"
    :label="label"
    :xtitle="xtitle"
    :ytitle="ytitle"
    :colors="[color]"
    :min="min"
    :max="max"
    :legend="legend"
    :prefix="prefix"
    :thousands="thousands"
  )
</template>

<script>
  import { Contract, Team } from '@/models'

  export default {
    name: 'PlayerHistoryChart',
    props: {
      player: {
        type: Object,
        required: true
      },
      attribute: {
        type: String,
        required: true
      },
      label: {
        type: String,
        default: null
      },
      color: {
        type: String,
        default: null
      },
      xtitle: {
        type: String,
        default: null
      },
      ytitle: {
        type: String,
        default: null
      },
      min: {
        type: Number,
        default: null
      },
      max: {
        type: Number,
        default: null
      },
      legend: {
        type: String,
        default: null
      },
      prefix: {
        type: String,
        default: null
      },
      thousands: {
        type: String,
        default: null
      }
    },
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      },
      lastContract () {
        return Contract
          .query()
          .orderBy('ended_on')
          .where('player_id', this.player.id)
          .last()
      },
      lastDate () {
        const contractEnd = this.lastContract && this.lastContract.ended_on
        return contractEnd && this.team.currently_on >= contractEnd
          ? contractEnd
          : this.team.currently_on
      },
      chartData () {
        return this.player.histories.reduce((data, history) => {
          data[history.recorded_on] = history[this.attribute]
          return data
        }, {
          [this.lastDate]: this.player[this.attribute]
        })
      }
    }
  }
</script>
