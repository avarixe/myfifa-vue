<template>
  <div class="text-center">
    <match-form
      :match-data="match"
      color="orange"
    >
      <template #default="{ on }">
        <tooltip-button
          label="Edit"
          icon="mdi-pencil"
          color="orange"
          :on="on"
        />
      </template>
    </match-form>

    <cap-form
      v-if="numPlayers < 11"
      :match="match"
    />

    <v-tooltip
      color="cyan"
      bottom
    >
      <template #activator="{ on: tooltip }">
        <v-menu
          offset-y
          class="d-inline-block"
        >
          <template #activator="{ on: menu }">
            <v-btn
              icon
              v-on="{ ...menu, ...tooltip }"
            >
              <v-icon color="cyan">mdi-clipboard-text</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="squad in squads"
              :key="squad.id"
              @click="applySquadToMatch(squad.id)"
            >
              {{ squad.name }}
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      Apply Squad
    </v-tooltip>

    <substitution-form
      v-if="validMatch"
      :match="match"
      color="green"
    />

    <goal-form
      v-if="validMatch"
      :match="match"
      color="blue"
    />

    <booking-form
      v-if="validMatch"
      :match="match"
      color="red"
    />

    <penalty-shootout-form
      v-if="validMatch && matchDraw && !match.penalty_shootout"
      :match="match"
      color="indigo"
    />

    <record-remove
      :record="match"
      store="matches"
      :label="`${match.home} v ${match.away}`"
      :redirect="linkTo('matches')"
    />
  </div>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import { Squad } from '@/models'
  import MatchForm from './Form'
  import CapForm from '@/components/Cap/Form'
  import GoalForm from '@/components/Goal/Form'
  import BookingForm from '@/components/Booking/Form'
  import SubstitutionForm from '@/components/Substitution/Form'
  import PenaltyShootoutForm from '@/components/PenaltyShootout/Form'
  import { RecordRemove, TooltipButton } from '@/helpers'

  @Component({
    components: {
      MatchForm,
      CapForm,
      GoalForm,
      BookingForm,
      SubstitutionForm,
      PenaltyShootoutForm,
      RecordRemove,
      TooltipButton
    }
  })
  export default class MatchActions extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) match

    get squads () {
      return Squad
        .query()
        .where('team_id', this.team.id)
        .get()
    }

    get active () {
      return this.match.status && this.match.status.length > 0
    }

    get validMatch () {
      return !this.match.team_result || this.numPlayers >= 11
    }

    get matchDraw () {
      return this.match.home_score === this.match.away_score
    }

    get numPlayers () {
      return this.match.caps.length
    }

    async applySquadToMatch (squadId) {
      try {
        await this.$store.dispatch('matches/APPLY_SQUAD', {
          matchId: this.match.id,
          squadId
        })
      } catch (e) {
        alert(e.message)
      }
    }
  }
</script>
