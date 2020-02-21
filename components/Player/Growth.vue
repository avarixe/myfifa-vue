<template lang="pug">
  v-card(flat)
    v-card-text
      v-row.text-center
        v-col(cols=12)
          .subheading Overall Rating
          player-history-chart(
            :player="player"
            attribute="ovr"
            color="#4caf50"
            :min="40"
            :max="100"
          )
        v-col(cols=12)
          .subheading Value
          player-history-chart(
            :player="player"
            attribute="value"
            color="#1976d2"
            :prefix="team.currency"
          )
</template>

<script>
  import PlayerHistoryChart from '@/components/Charts/PlayerHistoryChart'
  import { Team } from '@/models'

  export default {
    name: 'PlayerGrowth',
    components: {
      PlayerHistoryChart
    },
    props: {
      player: { type: Object, required: true }
    },
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      }
    }
  }
</script>
