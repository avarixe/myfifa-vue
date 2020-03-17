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
        @click="retirePlayer(player.id)"
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
  import { mapActions } from 'vuex'

  export default {
    name: 'PlayerRetire',
    props: {
      player: { type: Object, required: true }
    },
    data: () => ({
      snackbar: false
    }),
    methods: mapActions('players', {
      retirePlayer: 'RETIRE'
    })
  }
</script>
