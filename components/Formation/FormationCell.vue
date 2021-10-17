<script>
  import { toRef, computed } from '@nuxtjs/composition-api'

  export default {
    name: 'FormationCell',
    props: {
      pos: { type: String, default: null },
      player: { type: Object, default: null }
    },
    setup (props) {
      const player = toRef(props, 'player')
      const style = computed(() => ({
        visibility: player.value === null ? 'hidden' : null
      }))

      return { style }
    }
  }
</script>

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
