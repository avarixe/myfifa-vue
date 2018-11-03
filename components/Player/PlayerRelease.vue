<template>
  <div>
    <v-tooltip bottom color="brown">
      <v-btn
        @click.stop="snackbar = true"
        slot="activator"
        icon>
        <v-icon color="brown">mdi-door-open</v-icon>
      </v-btn>
      Release
    </v-tooltip>
    <v-snackbar
      v-model="snackbar"
      color="brown">
      Release Player: {{ player.name }}?
      <v-btn dark flat @click="$store.dispatch('player/release', player.id)">Yes</v-btn>
      <v-btn dark flat @click.stop="snackbar = false">No</v-btn>
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
