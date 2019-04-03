<template>
  <div
    class="d-inline-block"
    @click.stop="snackbar = true"
  >
    <slot>
      <v-tooltip
        bottom
        color="black"
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon>mdi-minus-circle</v-icon>
        </v-btn>
        Remove
      </v-tooltip>
    </slot>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove Player: {{ player.name }}?
      <v-btn
        dark
        flat
        @click="removePlayer"
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
    }),
    methods: {
      removePlayer () {
        this.$store.dispatch('entities/players/REMOVE', this.player.id)
        this.$router.push({
          name: 'teams-teamId-players',
          params: { teamId: this.player.team_id }
        })
      }
    }
  }
</script>
