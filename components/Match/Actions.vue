<template>
  <div class="text-xs-center">
    <match-form
      :match-data="match"
      color="orange"
    >
      <template #default="{ on: dialog }">
        <v-tooltip
          color="orange"
          bottom
        >
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...dialog, ...tooltip }"
              icon
            >
              <v-icon color="orange">mdi-pencil</v-icon>
            </v-btn>
          </template>
          Edit
        </v-tooltip>
      </template>
    </match-form>

    <cap-form
      v-if="numPlayers < 11"
      :match="match"
    >
      <template #default="{ on: dialog }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...dialog, ...tooltip }"
              icon
            >
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </template>
          Add Player
        </v-tooltip>
      </template>
    </cap-form>

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
              v-on="{ ...menu, ...tooltip }"
              icon
            >
              <v-icon color="cyan">mdi-clipboard-text</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="squad in squads"
              :key="squad.id"
              @click="applySquadToMatch(squad.id)"
            >{{ squad.name }}</v-list-item>
          </v-list>
        </v-menu>
      </template>
      Apply Squad
    </v-tooltip>

    <substitution-form
      v-if="validMatch"
      :match="match"
      color="green"
    >
      <template #default="{ on: dialog }">
        <v-tooltip
          bottom
          color="green"
        >
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...dialog, ...tooltip }"
              icon
            >
              <v-icon color="green">mdi-repeat</v-icon>
            </v-btn>
          </template>
          Substitution
        </v-tooltip>
      </template>
    </substitution-form>

    <goal-form
      v-if="validMatch"
      :match="match"
      color="blue"
    >
      <template #default="{ on: dialog }">
        <v-tooltip
          bottom
          color="blue"
        >
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...dialog, ...tooltip }"
              icon
            >
              <v-icon color="blue">mdi-soccer</v-icon>
            </v-btn>
          </template>
          Goal
        </v-tooltip>
      </template>
    </goal-form>

    <booking-form
      v-if="validMatch"
      :match="match"
      color="red"
    >
      <template #default="{ on: dialog }">
        <v-tooltip
          bottom
          color="red"
        >
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...dialog, ...tooltip }"
              icon
            >
              <v-icon color="red">mdi-book</v-icon>
            </v-btn>
          </template>
          Booking
        </v-tooltip>
      </template>
    </booking-form>

    <penalty-shootout-form
      v-if="validMatch && matchDraw && !match.penalty_shootout"
      :match="match"
      color="indigo"
    >
      <template #default="{ on: dialog }">
        <v-tooltip
          bottom
          color="indigo"
        >
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...dialog, ...tooltip }"
              icon
            >
              <v-icon color="indigo">mdi-human</v-icon>
            </v-btn>
          </template>
          Penalty Shootout
        </v-tooltip>
      </template>
    </penalty-shootout-form>

    <record-remove
      :record="match"
      store="matches"
      :label="`${match.home} v ${match.away}`"
      :redirect="team.linkTo('matches')"
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
  import { RecordRemove } from '@/helpers'

  @Component({
    components: {
      MatchForm,
      CapForm,
      GoalForm,
      BookingForm,
      SubstitutionForm,
      PenaltyShootoutForm,
      RecordRemove
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
