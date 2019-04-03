<template>
  <div
    class="text-xs-center"
  >
    <match-form
      :match-data="match"
      color="orange"
    >
      <v-tooltip
        color="orange"
        bottom
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon
            color="orange"
          >mdi-pencil</v-icon>
        </v-btn>
        Edit
      </v-tooltip>
    </match-form>

    <cap-form
      v-if="numPlayers < 11"
      :match="match"
    >
      <v-tooltip
        bottom
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
        Add Player
      </v-tooltip>
    </cap-form>

    <v-tooltip
      color="cyan"
      bottom
    >
      <v-menu
        slot="activator"
        offset-y
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon
            color="cyan"
          >mdi-clipboard-text</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="squad in squads"
            :key="squad.id"
            @click="applySquadToMatch(squad.id)"
          >{{ squad.name }}</v-list-tile>
        </v-list>
      </v-menu>
      Apply Squad
    </v-tooltip>

    <substitution-form
      v-if="validMatch"
      :match="match"
      color="green"
    >
      <v-tooltip
        bottom
        color="green"
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon
            color="green"
          >mdi-repeat</v-icon>
        </v-btn>
        Substitution
      </v-tooltip>
    </substitution-form>

    <goal-form
      v-if="validMatch"
      :match="match"
      color="blue"
    >
      <v-tooltip
        bottom
        color="blue"
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon
            color="blue"
          >mdi-soccer</v-icon>
        </v-btn>
        Goal
      </v-tooltip>
    </goal-form>

    <booking-form
      v-if="validMatch"
      :match="match"
      color="red"
    >
      <v-tooltip
        bottom
        color="red"
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon
            color="red"
          >mdi-book</v-icon>
        </v-btn>
        Booking
      </v-tooltip>
    </booking-form>

    <penalty-shootout-form
      v-if="validMatch && matchDraw && !match.penalty_shootout"
      :match="match"
      color="indigo"
    >
      <v-tooltip
        bottom
        color="indigo"
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon
            color="indigo"
          >mdi-human</v-icon>
        </v-btn>
        Penalty Shootout
      </v-tooltip>
    </penalty-shootout-form>

    <match-remove
      :match="match"
    />
  </div>
</template>

<script>
  import {
    mapActions
  } from 'vuex'
  import {
    TeamAccessible
  } from '@/mixins'
  import {
    Squad
  } from '@/models'
  import MatchForm from './MatchForm'
  import CapForm from './CapForm'
  import GoalForm from './GoalForm'
  import BookingForm from './BookingForm'
  import SubstitutionForm from './SubstitutionForm'
  import PenaltyShootoutForm from './PenaltyShootoutForm'
  import MatchRemove from './MatchRemove'

  export default {
    components: {
      MatchForm,
      CapForm,
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
    computed: {
      squads () {
        return Squad
          .query()
          .where('team_id', this.team.id)
          .get()
      },
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
        return this.match.caps.length
      }
    },
    methods: {
      ...mapActions('entities/matches', {
        applySquad: 'APPLY_SQUAD',
        remove: 'REMOVE'
      }),
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
