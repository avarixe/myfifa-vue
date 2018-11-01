<template>
  <div class="text-xs-center">
    <match-form :initial-match="match" color="orange">
      <v-tooltip bottom color="orange">
        <v-btn icon slot="activator">
          <v-icon color="orange">mdi-pencil</v-icon>
        </v-btn>
        Edit
      </v-tooltip>
    </match-form>

    <performance-form :match="match" v-if="numPlayers < 11">
      <v-tooltip bottom>
        <v-btn icon slot="activator">
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
        Add Player
      </v-tooltip>
    </performance-form>

    <v-tooltip bottom color="cyan">
      <v-menu slot="activator" offset-y>
        <v-btn slot="activator" icon>
          <v-icon color="cyan">mdi-clipboard-text</v-icon>
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
          <v-icon color="green">mdi-repeat</v-icon>
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
          <v-icon color="blue">mdi-soccer</v-icon>
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
          <v-icon color="red">mdi-book</v-icon>
        </v-btn>
        Booking
      </v-tooltip>
    </booking-form>

    <penalty-shootout-form
      v-if="validMatch && matchDraw && !match.penalty_shootout"
      :match="match"
      color="indigo">
      <v-tooltip bottom color="indigo">
        <v-btn icon slot="activator">
          <v-icon color="indigo">mdi-human</v-icon>
        </v-btn>
        Penalty Shootout
      </v-tooltip>
    </penalty-shootout-form>

    <match-remove :match="match"></match-remove>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import MatchForm from '@/components/Match/MatchForm'
  import PerformanceForm from '@/components/Match/PerformanceForm'
  import GoalForm from '@/components/Match/GoalForm'
  import BookingForm from '@/components/Match/BookingForm'
  import SubstitutionForm from '@/components/Match/SubstitutionForm'
  import PenaltyShootoutForm from '@/components/Match/PenaltyShootoutForm'
  import MatchRemove from '@/components/Match/MatchRemove'

  export default {
    components: {
      MatchForm,
      PerformanceForm,
      GoalForm,
      BookingForm,
      SubstitutionForm,
      PenaltyShootoutForm,
      MatchRemove
    },
    mixins: [ TeamAccessible ],
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data: () => ({}),
    computed: {
      ...mapState('squad', {
        squads: 'list'
      }),
      active () {
        return this.match.status && this.match.status.length > 0
      },
      validMatch () {
        return !this.match.team_result || this.numPlayers >= 11
      },
      matchDraw () {
        return this.match.home_score === this.match.away_score
      },
      numPlayers () {
        return Object.values(this.match.performances || {}).length
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
