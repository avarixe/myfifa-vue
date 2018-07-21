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

    <substitution-form
      v-if="validMatch"
      :match="match"
      color="green">
      <v-tooltip bottom color="green">
        <v-btn icon slot="activator">
          <v-icon color="green">repeat</v-icon>
        </v-btn>
        Substitution
      </v-tooltip>
    </substitution-form>

    <goal-form
      v-if="validMatch"
      :match="match"
      color="blue">
      <v-tooltip bottom color="blue">
        <v-btn icon slot="activator">
          <v-icon color="blue">camera</v-icon>
        </v-btn>
        Goal
      </v-tooltip>
    </goal-form>

    <booking-form
      v-if="validMatch"
      :match="match"
      color="red">
      <v-tooltip bottom color="red">
        <v-btn icon slot="activator">
          <v-icon color="red">book</v-icon>
        </v-btn>
        Booking
      </v-tooltip>
    </booking-form>

    <penalty-shootout-form
      v-if="validMatch && matchDraw &&  !match.penalty_shootout"
      :match="match"
      color="indigo">
      <v-tooltip bottom color="indigo">
        <v-btn icon slot="activator">
          <v-icon color="indigo">accessibility_new</v-icon>
        </v-btn>
        Penalty Shootout
      </v-tooltip>
    </penalty-shootout-form>

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
  import BookingForm from '@/components/Match/BookingForm'
  import SubstitutionForm from '@/components/Match/SubstitutionForm'
  import PenaltyShootoutForm from '@/components/Match/PenaltyShootoutForm'

  export default {
    components: {
      'match-form': MatchForm,
      'match-log-form': MatchLogForm,
      'goal-form': GoalForm,
      'booking-form': BookingForm,
      'substitution-form': SubstitutionForm,
      'penalty-shootout-form': PenaltyShootoutForm
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
      },
      validMatch () {
        return !this.match.team_result || this.match.match_logs.length >= 11
      },
      matchDraw () {
        return this.match.home_score === this.match.away_score
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
