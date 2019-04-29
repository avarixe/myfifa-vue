<template>
  <div
    class="d-inline-block"
    @click.stop="snackbar = true"
  >
    <slot>
      <v-btn dark>Remove</v-btn>
    </slot>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove Team: {{ team.title }}?
      <v-btn
        dark
        flat
        @click="removeTeam"
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
      team: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    }),
    methods: {
      removeTeam () {
        this.$store.dispatch('teams/REMOVE', this.team.id)
        this.$router.push({ name: 'teams' })
      }
    }
  }
</script>
