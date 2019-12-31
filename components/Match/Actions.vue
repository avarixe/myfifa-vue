<template lang="pug">
  .text-center
    match-form(:record="match" color="orange")
      template(#default="{ on }")
        tooltip-button(
          label="Edit"
          icon="mdi-pencil"
          color="orange"
          :on="on"
        )
    cap-form(v-if="numPlayers < 11" :match="match")
    v-tooltip(color="cyan" bottom)
      template(#activator="{ on: tooltip }")
        v-menu.d-inline-block(offset-y)
          template(#activator="{ on: menu }")
            v-btn(icon v-on="{ ...menu, ...tooltip }")
              v-icon(color="cyan") mdi-clipboard-text
          v-list
            v-list-item(
              v-for="squad in squads"
              :key="squad.id"
              @click="applySquadToMatch(squad.id)"
            ) {{ squad.name }}
      | Apply Squad
    substitution-form(v-if="validMatch" :match="match" color="green")
    goal-form(v-if="validMatch" :match="match" color="blue")
    booking-form(v-if="validMatch" :match="match" color="red")
    penalty-shootout-form(
      v-if="validMatch && matchDraw && !match.penalty_shootout"
      :match="match"
      color="indigo"
    )
    record-remove(
      :record="match"
      store="matches"
      :label="`${match.home} v ${match.away}`"
      :redirect="linkTo('matches')"
    )
</template>

<script>
  import { mapActions } from 'vuex'
  import { TeamAccessible } from '@/mixins'
  import { Squad } from '@/models'
  import MatchForm from './Form'
  import CapForm from '@/components/Cap/Form'
  import GoalForm from '@/components/Goal/Form'
  import BookingForm from '@/components/Booking/Form'
  import SubstitutionForm from '@/components/Substitution/Form'
  import PenaltyShootoutForm from '@/components/PenaltyShootout/Form'

  export default {
    name: 'MatchActions',
    components: {
      MatchForm,
      CapForm,
      GoalForm,
      BookingForm,
      SubstitutionForm,
      PenaltyShootoutForm
    },
    mixins: [
      TeamAccessible
    ],
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
      ...mapActions('matches', {
        applySquad: 'APPLY_SQUAD'
      }),
      async applySquadToMatch (squadId) {
        try {
          await this.applySquad({
            matchId: this.match.id,
            squadId
          })
        } catch (e) {
          alert(e.message)
        }
      }
    }
  }
</script>
