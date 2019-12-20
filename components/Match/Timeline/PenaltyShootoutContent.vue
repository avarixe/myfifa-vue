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
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Match } from '@/models'

  @Component
  export default class PenaltyShootoutContent extends Vue {
    @Prop({ type: Object, required: true }) item

    get match () {
      return Match.find(this.$route.params.matchId)
    }

    get winner () {
      return this.item.home_score > this.item.away_score
        ? this.match.home
        : this.match.away
    }

    get score () {
      return this.item.home_score > this.item.away_score
        ? `${this.item.home_score} - ${this.item.away_score}`
        : `${this.item.away_score} - ${this.item.home_score}`
    }
  }
</script>
