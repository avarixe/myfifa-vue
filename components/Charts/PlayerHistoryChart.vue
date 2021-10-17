<script>
  import { toRef, computed, useStore } from '@nuxtjs/composition-api'
  import Vue from 'vue'
  import { format, parseISO } from 'date-fns'
  import { useTeam } from '@/composables'

  export default {
    name: 'PlayerHistoryChart',
    props: {
      player: { type: Object, required: true },
      attribute: { type: String, required: true },
      color: { type: String, default: '#d70206' },
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      prefix: { type: String, default: null },
      ratio: { type: String, default: 'ct-major-tenth' }
    },
    setup (props) {
      const { team } = useTeam()

      const store = useStore()
      const player = toRef(props, 'player')
      const lastContract = computed(() =>
        store.$db().model('Contract')
          .query()
          .orderBy('endedOn')
          .where('playerId', player.value.id)
          .last()
      )

      const lastDate = computed(() => {
        const contractEnd = lastContract.value?.endedOn
        return contractEnd && team.value.currentlyOn >= contractEnd
          ? contractEnd
          : team.value.currentlyOn
      })

      const chartData = computed(() => {
        let series = []

        series.push({
          data: player.value.histories.reduce((data, history) => {
            data.splice(-1, 0, {
              x: parseISO(history.recordedOn),
              y: history[props.attribute]
            })
            return data
          }, [
            {
              x: parseISO(lastDate.value),
              y: player.value[props.attribute]
            }
          ])
        })

        return { series }
      })

      const dateAxis = computed(() => ({
        type: Vue.chartist.FixedScaleAxis,
        divisor: 5,
        labelInterpolationFnc: value => format(value, 'MMM d, yyyy')
      }))

      const formatDate = date => format(date, 'MMM d, yyyy')

      return {
        chartData,
        dateAxis,
        formatDate
      }
    }
  }
</script>

<template>
  <base-line-chart
    :chart-data="chartData"
    :color="color"
    :min="min"
    :max="max"
    :prefix="prefix"
    :ratio="ratio"
    show-area
    :tooltip-x-modifier="x => formatDate(x)"
    :axis-x="dateAxis"
  />
</template>
