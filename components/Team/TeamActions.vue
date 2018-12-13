<template>
  <v-btn-toggle>
    <v-tooltip bottom color="blue darken-2">
      <v-btn
        slot="activator"
        :to="{ name: 'teams-teamId-matches', params: { teamId: team.id } }"
        icon>
        <v-icon color="blue darken-2">mdi-arrow-right</v-icon>
      </v-btn>
      Access
    </v-tooltip>
    <team-form :team-id="team.id" color="orange">
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
      v-model="snackbar"
      color="black">
      Remove Team: {{ team.title }}?
      <v-btn class="white--text" flat @click.stop="$store.dispatch('entities/teams/REMOVE', team.id)">Yes</v-btn>
      <v-btn class="white--text" flat @click.stop="snackbar = false">No</v-btn>
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
