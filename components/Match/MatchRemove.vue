<template>
  <div class="d-inline-block" @click.stop="snackbar = true">
    <slot>
      <v-tooltip bottom color="black">
        <v-btn icon slot="activator">
          <v-icon color="black">mdi-minus-circle</v-icon>
        </v-btn>
        Remove
      </v-tooltip>
    </slot>
    <v-snackbar
      v-model="snackbar"
      color="black">
      Remove Match: {{ match.home }} v {{ match.away }}?
      <v-btn dark flat @click="removeMatch">Yes</v-btn>
      <v-btn dark flat @click.stop="snackbar = false">No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    }),
    methods: {
      removeMatch () {
        this.$store.dispatch('entities/matches/REMOVE', this.match.id)
        this.$router.push({
          name: 'teams-id-matches',
          params: { id: this.match.team_id }
        })
      }
    }
  }
</script>
