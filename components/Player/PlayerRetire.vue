<template>
  <div>
    <v-tooltip bottom color="purple">
      <v-btn
        @click.stop="snackbar = true"
        slot="activator"
        icon>
        <v-icon color="purple">mdi-human-greeting</v-icon>
      </v-btn>
      Retire
    </v-tooltip>
    <v-snackbar
      v-model="snackbar"
      color="purple">
      {{ player.name }} is Retiring End of Season?
      <v-btn dark flat @click="$store.dispatch('player/retire', player.id)">Yes</v-btn>
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
