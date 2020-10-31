<template>
  <div class="text-center">
    <cap-form
      v-if="match.caps.length < 11"
      :match="match"
    />
    <match-squad-applier :match="match" />
    <match-squad-saver :match="match" />
    <penalty-shootout-form
      v-if="validMatch && matchDraw && !match.penalty_shootout"
      :match="match"
      color="indigo"
    />
  </div>
</template>

<script>
  export default {
    name: 'MatchActions',
    props: {
      match: { type: Object, required: true }
    },
    computed: {
      active () {
        return this.match.status && this.match.status.length > 0
      },
      validMatch () {
        return !this.match.team_result || this.numPlayers >= 11
      },
      matchDraw () {
        return this.match.home_score === this.match.away_score
      },
      numPlayers () {
        return this.match.caps.length
      }
    }
  }
</script>
