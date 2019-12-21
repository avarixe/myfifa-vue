<template lang="pug">
  div
    span.font-weight-bold {{ winner }}
    |&nbsp;
    | wins by Penalty Shootout (
    span.font-weight-bold {{ score }}
    | )
  </span>
</template>

<script>
  import { Match } from '@/models'

  export default {
    name: 'PenaltyShootoutContent',
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
