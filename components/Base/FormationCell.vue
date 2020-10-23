<template>
  <v-col
    cols="2"
    class="text-center"
    :style="style"
  >
    <template v-if="pos">
      <v-icon :color="color">{{ icon }}</v-icon>
      <slot :players="players" />
    </template>
  </v-col>
</template>

<script>
  export default {
    name: 'FormationCell',
    props: {
      pos: { type: String, default: null },
      players: { type: Array, required: true }
    },
    computed: {
      isEmpty () {
        return this.players.length === 0
      },
      color () {
        return ''
        // return this.isEmpty ? '' : 'primary'
      },
      icon () {
        if (this.isEmpty) {
          return 'mdi-account-outline'
        } else if (this.players.length > 1) {
          return 'mdi-account-multiple'
        } else {
          return 'mdi-account'
        }
      },
      style () {
        return {
          visibility: this.isEmpty ? 'hidden' : null
        }
      }
    }
  }
</script>
