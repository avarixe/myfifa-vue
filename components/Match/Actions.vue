<template lang="pug">
  .text-center
    cap-form(v-if="match.caps.length < 11" :match="match")
    match-squad-applier(:match="match")
    match-squad-saver(:match="match")
    substitution-form(v-if="validMatch" :match="match" color="green")
    goal-form(v-if="validMatch" :match="match" color="blue")
    booking-form(v-if="validMatch" :match="match" color="red")
    penalty-shootout-form(
      v-if="validMatch && matchDraw && !match.penalty_shootout"
      :match="match"
      color="indigo"
    )
</template>

<script>
  import CapForm from '@/components/Cap/Form'
  import MatchSquadApplier from './SquadApplier'
  import MatchSquadSaver from './SquadSaver'
  import GoalForm from '@/components/Goal/Form'
  import BookingForm from '@/components/Booking/Form'
  import SubstitutionForm from '@/components/Substitution/Form'
  import PenaltyShootoutForm from '@/components/PenaltyShootout/Form'

  export default {
    name: 'MatchActions',
    components: {
      CapForm,
      MatchSquadApplier,
      MatchSquadSaver,
      GoalForm,
      BookingForm,
      SubstitutionForm,
      PenaltyShootoutForm
    },
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    computed: {
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
    }
  }
</script>
