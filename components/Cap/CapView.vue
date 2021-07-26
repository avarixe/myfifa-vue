<template>
  <div class="cap">
    <div class="font-weight-bold">{{ cap.pos }}</div>
    <div class="player-name">{{ player.name }}</div>
    <cap-events
      :cap="cap"
      :match="match"
    />
  </div>
</template>

<script>
  export default {
    name: 'CapView',
    props: {
      cap: { type: Object, required: true },
      match: { type: Object, required: true }
    },
    computed: {
      player () {
        return this.$store.$db().model('Player').find(this.cap.playerId)
      }
    }
  }
</script>

<style scoped lang="scss">
  .cap {
    line-height: 1.5;

    .player-name {
      font-size: 0.8em;
      line-height: 1;
      display: inline-block;
    }
  }
</style>
