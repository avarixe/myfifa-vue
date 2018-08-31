<template>
  <div>
    <team-form :initial-team="team" color="orange">
      <v-tooltip bottom color="orange darken-2">
        <v-btn icon slot="activator">
          <v-icon color="orange darken-2">edit</v-icon>
        </v-btn>
        Edit
      </v-tooltip>
    </team-form>
    <v-tooltip bottom color="black">
      <v-btn icon slot="activator" @click.stop="snackbar = true">
        <v-icon color="black">remove_circle</v-icon>
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
  </div>
</template>

<script>
  import TeamForm from '@/components/Team/TeamForm'

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
    data () {
      return {
        snackbar: false
      }
    }
  }
</script>
