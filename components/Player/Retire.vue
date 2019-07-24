<template>
  <div class="d-inline-block">
    <v-tooltip
      bottom
      color="purple"
    >
      <template #activator="{ on }">
        <v-btn
          icon
          v-on="on"
          @click.stop="snackbar = true"
        >
          <v-icon color="purple">mdi-human-greeting</v-icon>
        </v-btn>
      </template>
      Retire
    </v-tooltip>

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

  @Component
  export default class PlayerRetire extends Vue {
    @Prop({ type: Object, required: true }) player

    snackbar = false
  }
</script>
