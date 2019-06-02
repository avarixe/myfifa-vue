<template>
  <material-chart-card
    :data="chartData"
    :options="options"
    ratio="ct-major-twelfth"
    type="Bar"
  >
    <season-results-table :season-data="seasonData" />
  </material-chart-card>
</template>

<script>
  import { MaterialChartCard } from '@/helpers'
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
        wins: 0,
        losses: 0,
        draws: 0,
        options: {
        }
      }
    },
    computed: {
      competitions () {
        return Object.entries(this.seasonData.results)
      },
      total () {
        return this.wins + this.losses + this.draws
      },
      chartData () {
        let labels = ['Total']
        let series = [
          [this.wins],
          [this.draws],
          [this.losses]
        ]

        this.competitions.forEach(([competition, data]) => {
          labels.push(competition)
          series[0].push(data.wins)
          series[1].push(data.draws)
          series[2].push(data.losses)
        })

        return {
          labels,
          series
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
        const percentage = Math.round(value / this.total * 100)
        return `${this.labels[idx]} ${percentage}%`
      }
    }
  }
</script>
