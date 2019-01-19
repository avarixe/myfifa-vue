<template>
  <material-chart-card
    :data="chartData"
    :options="options"
    ratio="ct-major-twelfth"
    type="Pie"
  >
    <season-results-table
      :season-data="seasonData"
    ></season-results-table>
  </material-chart-card>
</template>

<script>
  import MaterialChartCard from '@/components/theme/ChartCard'
  import SeasonResultsTable from './SeasonResultsTable'

  export default {
    components: {
      MaterialChartCard,
      SeasonResultsTable
    },
    props: {
      seasonData: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        labels: ['Wins', 'Losses', 'Draws'],
        wins: 0,
        losses: 0,
        draws: 0,
        options: {
          labelInterpolationFnc: this.sliceLabel
        }
      }
    },
    computed: {
      total () {
        return this.wins + this.losses + this.draws
      },
      chartData () {
        return {
          series: [
            this.wins,
            this.losses,
            this.draws
          ]
        }
      }
    },
    watch: {
      seasonData: {
        immediate: true,
        handler (val) {
          let wins = 0
          let losses = 0
          let draws = 0

          Object.entries(val.results)
            .forEach(([competition, data]) => {
              wins += data.wins || 0
              losses += data.losses || 0
              draws += data.draws || 0
            })

          this.wins = wins
          this.losses = losses
          this.draws = draws
        }
      }
    },
    methods: {
      sliceLabel (value, idx) {
        var percentage = Math.round(value / this.total * 100)
        console.log(value, this.total, percentage)
        return `${this.labels[idx]} ${percentage}%`
      }
    }
  }
</script>
