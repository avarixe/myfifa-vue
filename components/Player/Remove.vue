<template>
  <div class="d-inline-block">
    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          @click="snackbar = true"
          icon
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      Remove
    </v-tooltip>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove Player: {{ player.name }}?
      <v-btn
        dark
        text
        @click="removePlayer"
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
  export default {
    props: {
      player: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    }),
    methods: {
      removePlayer () {
        this.$store.dispatch('players/REMOVE', this.player.id)

        this.$router.push({
          name: 'teams-teamId-players',
          params: { teamId: this.player.team_id }
        })
      }
    }
  }
</script>
