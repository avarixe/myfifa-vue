<template lang="pug">
  .d-inline-block
    tooltip-button(
      label="Release"
      icon="mdi-door-open"
      color="brown"
      @click="snackbar = true"
    )
    v-snackbar(v-model="snackbar" color="brown")
      | Release Player: {{ player.name }}?
      v-btn(dark text @click="releasePlayer(player.id)") Yes
      v-btn(dark text @click.stop="snackbar = false") No
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'PlayerRelease',
    props: {
      player: { type: Object, required: true }
    },
    data: () => ({
      snackbar: false
    }),
    methods: mapActions('players', {
      releasePlayer: 'RELEASE'
    })
  }
</script>
