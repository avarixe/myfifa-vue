<template>
  <div class="d-inline-block">
    <tooltip-button
      label="Retire"
      icon="mdi-human-greeting"
      color="purple"
      @click="snackbar = true"
    />

    <v-snackbar
      v-model="snackbar"
      color="purple"
    >
      {{ player.name }} is Retiring End of Season?
      <v-btn
        dark
        text
        @click="$store.dispatch('players/RETIRE', player.id)"
      >
        Yes
      </v-btn>
      <v-btn
        dark
        text
        @click.stop="snackbar = false"
      >
        No
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { TooltipButton } from '@/helpers'

  @Component({
    components: {
      TooltipButton
    }
  })
  export default class PlayerRetire extends Vue {
    @Prop({ type: Object, required: true }) player

    snackbar = false
  }
</script>
