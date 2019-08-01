<template>
  <div class="d-inline-block">
    <tooltip-button
      label="Release"
      icon="mdi-door-open"
      color="brown"
      @click="snackbar = true"
    />

    <v-snackbar
      v-model="snackbar"
      color="brown"
    >
      Release Player: {{ player.name }}?
      <v-btn
        dark
        text
        @click="$store.dispatch('players/RELEASE', player.id)"
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
  export default class PlayerRelease extends Vue {
    @Prop({ type: Object, required: true }) player

    snackbar = false
  }
</script>
