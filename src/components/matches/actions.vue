<template>
  <v-card-text id="actions" class="text-xs-center pa-0">
    <match-form :initial-match="match" color="orange">
      <v-tooltip bottom color="orange">
        <v-btn icon slot="activator">
          <v-icon color="orange">edit</v-icon>
        </v-btn>
        Edit
      </v-tooltip>
    </match-form>

    <v-tooltip bottom color="blue">
      <v-btn icon slot="activator">
        <v-icon color="blue">camera</v-icon>
      </v-btn>
      Goal
    </v-tooltip>

    <v-tooltip bottom color="red">
      <v-btn icon slot="activator">
        <v-icon color="red">book</v-icon>
      </v-btn>
      Booking
    </v-tooltip>

    <v-tooltip bottom color="green">
      <v-btn icon slot="activator">
        <v-icon color="green">repeat</v-icon>
      </v-btn>
      Substitution
    </v-tooltip>

    <v-tooltip bottom color="pink">
      <v-btn icon slot="activator">
        <v-icon color="pink">local_hospital</v-icon>
      </v-btn>
      Injury
    </v-tooltip>

    <v-tooltip bottom color="indigo">
      <v-btn icon slot="activator">
        <v-icon color="indigo">pan_tool</v-icon>
      </v-btn>
      Penalty Shootout
    </v-tooltip>

    <v-tooltip bottom color="black">
      <v-btn icon slot="activator" @click.native="promptDeletion = true">
        <v-icon color="black">remove_circle</v-icon>
      </v-btn>
      Remove
    </v-tooltip>

    <v-snackbar
      color="black"
      v-model="promptDeletion">
      Remove Match: {{ match.home }} v {{ match.away }}?
      <v-btn dark flat @click.native="destroy(match.id)">Yes</v-btn>
      <v-btn dark flat @click.native="promptDeletion = false">No</v-btn>
    </v-snackbar>
  </v-card-text>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import MatchForm from '@/components/matches/form'

  export default {
    props: [
      'match'
    ],
    data: () => ({
      promptDeletion: false
    }),
    computed: {
      ...mapState('team', {
        team: 'active'
      }),
      active () {
        return this.match.status && this.match.status.length > 0
      }
    },
    methods: mapActions('match', [
      'destroy'
    ]),
    components: {
      'match-form': MatchForm
    }
  }
</script>
