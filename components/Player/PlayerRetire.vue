<template>
  <div class="d-inline-block">
    <v-tooltip
      bottom
      color="purple"
    >
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          icon
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
        flat
        @click="$store.dispatch('players/RETIRE', player.id)"
      >Yes</v-btn>
      <v-btn
        dark
        flat
        @click.stop="snackbar = false"
      >No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    props: {
      player: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    })
  }
</script>
