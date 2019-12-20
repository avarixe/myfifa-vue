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
  import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator'
  import { TooltipButton } from '@/helpers'

  const players = namespace('players')

  @Component({
    components: {
      TooltipButton
    }
  })
  export default class PlayerRelease extends Vue {
    @players.Action('RELEASE') releasePlayer
    @Prop({ type: Object, required: true }) player

    snackbar = false
  }
</script>
