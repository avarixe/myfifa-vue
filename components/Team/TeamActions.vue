<template>
  <v-btn-toggle>
    <v-tooltip bottom color="blue darken-2">
      <v-btn
        slot="activator"
        :to="{ name: 'teams-id', params: { id: team.id } }"
        icon>
        <v-icon color="blue darken-2">mdi-view-dashboard</v-icon>
      </v-btn>
      Dashboard
    </v-tooltip>
    <team-form :initial-team="team" color="orange">
      <v-tooltip bottom color="orange darken-2">
        <v-btn icon slot="activator">
          <v-icon color="orange darken-2">mdi-pencil</v-icon>
        </v-btn>
        Edit
      </v-tooltip>
    </team-form>
    <v-tooltip bottom color="black">
      <v-btn icon slot="activator" @click.stop="snackbar = true">
        <v-icon color="black">mdi-minus-circle</v-icon>
      </v-btn>
      Remove
    </v-tooltip>
    <v-snackbar
      color="black"
      v-model="snackbar">
      Remove Team: {{ team.title }}?
      <v-btn dark flat @click.stop="this.$store.dispatch('team/remove', team.id)">Yes</v-btn>
      <v-btn dark flat @click.stop="snackbar = false">No</v-btn>
    </v-snackbar>
  </v-btn-toggle>
</template>

<script>
  import TeamForm from './TeamForm'

  export default {
    components: {
      TeamForm
    },
    props: {
      team: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    })
  }
</script>
