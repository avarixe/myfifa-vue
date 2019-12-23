<template lang="pug">
  .d-inline-block
    tooltip-button(
      label="Retire"
      icon="mdi-human-greeting"
      color="purple"
      @click="snackbar = true"
    )
    v-snackbar(v-model="snackbar" color="purple")
      | {{ player.name }} is Retiring End of Season?
      v-btn(dark text @click="retirePlayer(player.id)") Yes
      v-btn(dark text @click.stop="snackbar = false") No
</template>

<script>
  import { mapActions } from 'vuex'
  import { TooltipButton } from '@/helpers'

  export default {
    name: 'PlayerRetire',
    components: {
      TooltipButton
    },
    props: {
      player: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    }),
    methods: mapActions('players', {
      retirePlayer: 'RETIRE'
    })
  }
</script>
