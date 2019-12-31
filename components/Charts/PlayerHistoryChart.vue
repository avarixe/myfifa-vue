<template lang="pug">
  chartist(
    type="Line"
    :ratio="ratio"
    :data="chartData"
    :options="options"
    :event-handlers="eventHandlers"
  )
</template>

<script>
  import { format, parseISO } from 'date-fns'
  // import { parseISO } from 'date-fns'
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
      color: {
        type: String,
        default: '#d70206'
      },
      min: {
        type: Number,
        default: null
      },
      max: {
        type: Number,
        default: null
      },
      prefix: {
        type: String,
        default: null
      },
      ratio: {
        type: String,
        default: 'ct-major-tenth'
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
        let series = []

        series.push({
          data: this.player.histories.reduce((data, history) => {
            data.splice(-1, 0, {
              x: parseISO(history.recorded_on),
              y: history[this.attribute]
            })
            return data
          }, [
            {
              x: parseISO(this.lastDate),
              y: this.player[this.attribute]
            }
          ])
        })

        return { series }
      },
      options () {
        const prefix = this.prefix || ''
        return {
          axisX: {
            type: this.$chartist.FixedScaleAxis,
            divisor: 5,
            labelInterpolationFnc: value => format(value, 'MMM d, yyyy')
          },
          axisY: {
            offset: 80,
            labelInterpolationFnc (value) {
              return `${prefix}${value.toLocaleString()}`
            }
          },
          low: this.min,
          high: this.max,
          onlyInteger: true,
          showArea: true
        }
      },
      eventHandlers () {
        const color = this.color
        return [{
          event: 'draw',
          fn (context) {
            switch (context.type) {
              case 'area':
                context.element.attr({
                  style: `fill: ${color}`
                })
                break
              case 'point':
              case 'line':
                context.element.attr({
                  style: `stroke: ${color}`
                })
            }
          }
        }]
      }
    }
  }
</script>
