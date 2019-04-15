<template>
  <v-flex
    layout
    class="py-0"
  >
    <v-btn
      :to="{ name: 'teams-teamId-matches', params: { teamId: team.id } }"
      icon
    >
      <v-icon
        color="blue darken-2"
      >mdi-arrow-right</v-icon>
    </v-btn>

    <team-form
      :team-id="team.id"
      color="orange"
    >
      <v-btn
        icon
      >
        <v-icon
          color="orange darken-2"
        >mdi-pencil</v-icon>
      </v-btn>
    </team-form>

    <v-btn
      icon
      @click.stop="snackbar = true"
    >
      <v-icon
        color="black"
      >mdi-minus-circle</v-icon>
    </v-btn>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove Team: {{ team.title }}?
      <v-btn
        class="white--text"
        flat
        @click.stop="$store.dispatch('teams/REMOVE', team.id)"
      >Yes</v-btn>
      <v-btn
        class="white--text"
        flat
        @click.stop="snackbar = false"
      >No</v-btn>
    </v-snackbar>
  </v-flex>
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
