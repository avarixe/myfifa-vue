<template>
  <div>
    <div class="font-weight-bold">{{ cap.pos }}</div>
    <scroll-text
      :text="player.name"
      :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
    />
    <cap-rating
      :cap="cap"
      readonly
    />
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
