<template>
  <v-col
    cols="2"
    class="text-center"
    :style="style"
  >
    <template v-if="pos && player">
      <slot
        :pos="pos"
        :player="player"
      />
    </template>
  </v-col>
</template>

<script>
  export default {
    name: 'FormationCell',
    props: {
      pos: { type: String, default: null },
      player: { type: Object, default: null }
    },
    computed: {
      style () {
        return {
          visibility: this.player === null ? 'hidden' : null
        }
      }
    }
  }
</script>
