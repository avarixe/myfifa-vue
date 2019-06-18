<template>
  <div class="d-inline-block">
    <v-tooltip
      bottom
      color="brown"
    >
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          icon
          @click.stop="snackbar = true"
        >
          <v-icon color="brown">mdi-door-open</v-icon>
        </v-btn>
      </template>
      Release
    </v-tooltip>

    <v-snackbar
      v-model="snackbar"
      color="brown"
    >
      Release Player: {{ player.name }}?
      <v-btn
        dark
        text
        @click="$store.dispatch('players/RELEASE', player.id)"
      >Yes</v-btn>
      <v-btn
        dark
        text
        @click.stop="snackbar = false"
      >No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class PlayerRelease extends Vue {
    @Prop({ type: Object, required: true }) player

    snackbar = false
  }
</script>
