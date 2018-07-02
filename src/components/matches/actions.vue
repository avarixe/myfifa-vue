<template>
  <v-card-text id="actions" class="text-xs-center pa-0">
    <match-form :initial-match="match" color="orange">
      <v-tooltip bottom color="orange">
        <v-btn icon slot="activator">
          <v-icon color="orange">edit</v-icon>
        </v-btn>
        <span>Edit</span>
      </v-tooltip>
    </match-form>
    <v-tooltip bottom color="black">
      <v-btn icon slot="activator" @click.native="promptDeletion = true">
        <v-icon color="black">remove_circle</v-icon>
      </v-btn>
      <span>Remove</span>
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
