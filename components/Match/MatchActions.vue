<template>
  <div class="text-xs-center">
    <match-form :initial-match="match" color="orange">
      <v-tooltip bottom color="orange">
        <v-btn icon slot="activator">
          <v-icon color="orange">edit</v-icon>
        </v-btn>
        Edit
      </v-tooltip>
    </match-form>

    <match-log-form :match="match" v-if="match.match_logs.length < 11">
      <v-tooltip bottom>
        <v-btn icon slot="activator">
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
        Add Player
      </v-tooltip>
    </match-log-form>

    <v-tooltip bottom>
      <v-menu slot="activator" offset-y>
        <v-btn slot="activator" icon>
          <v-icon>people_outline</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="(squad, squadId) in squads"
            :key="squadId"
            @click="applySquadToMatch(squadId)">
            {{ squad.name }}
          </v-list-tile>
        </v-list>
      </v-menu>
      Apply Squad
    </v-tooltip>

    <v-tooltip v-if="match.match_logs.length >= 11" bottom color="green">
      <v-btn icon slot="activator">
        <v-icon color="green">repeat</v-icon>
      </v-btn>
      Substitution
    </v-tooltip>

    <goal-form :match="match" color="blue">
      <v-tooltip v-if="match.match_logs.length >= 11" bottom color="blue">
        <v-btn icon slot="activator">
          <v-icon color="blue">camera</v-icon>
        </v-btn>
        Goal
      </v-tooltip>
    </goal-form>

    <v-tooltip v-if="match.match_logs.length >= 11" bottom color="red">
      <v-btn icon slot="activator">
        <v-icon color="red">book</v-icon>
      </v-btn>
      Booking
    </v-tooltip>

    <v-tooltip v-if="match.match_logs.length >= 11" bottom color="indigo">
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
      <v-btn dark flat @click.native="remove(match.id)">Yes</v-btn>
      <v-btn dark flat @click.native="promptDeletion = false">No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import MatchForm from '@/components/Match/MatchForm'
  import MatchLogForm from '@/components/Match/MatchLogForm'
  import GoalForm from '@/components/Match/GoalForm'

  export default {
    components: {
      'match-form': MatchForm,
      'match-log-form': MatchLogForm,
      'goal-form': GoalForm
    },
    mixins: [ TeamAction ],
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      promptDeletion: false
    }),
    computed: {
      ...mapState('squad', {
        squads: 'list'
      }),
      active () {
        return this.match.status && this.match.status.length > 0
      }
    },
    methods: {
      ...mapActions('match', [
        'applySquad',
        'remove'
      ]),
      async applySquadToMatch (squadId) {
        try {
          await this.applySquad({
            matchId: this.match.id,
            squadId: squadId
          })
        } catch (e) {
          alert(e.message)
        }
      }
    }
  }
</script>
