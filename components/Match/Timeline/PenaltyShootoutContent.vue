<template>
  <span>
    <span
      class="font-weight-bold"
      v-text="winner"
    />
    wins by Penalty Shootout
    (
    <span
      class="font-weight-bold"
      v-text="score"
    />
    )
  </span>
</template>

<script>
  import { Match } from '@/models'

  export default {
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      match () {
        return Match.find(this.$route.params.matchId)
      },
      winner () {
        return this.item.home_score > this.item.away_score
          ? this.match.home
          : this.match.away
      },
      score () {
        return this.item.home_score > this.item.away_score
          ? `${this.item.home_score} - ${this.item.away_score}`
          : `${this.item.away_score} - ${this.item.home_score}`
      }
    }
  }
</script>
