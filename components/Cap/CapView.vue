<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <div v-on="on">
        <div class="font-weight-bold">{{ cap.pos }}</div>
        <v-icon>mdi-shield-account</v-icon>
        <cap-events
          :cap="cap"
          :match="match"
        />
      </div>
    </template>
    {{ player.name }}
  </v-tooltip>
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
