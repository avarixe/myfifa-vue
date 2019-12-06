<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-soccer"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Goal"
          icon="mdi-soccer"
          color="blue"
          :on="on"
        />
      </slot>
    </template>

    <template #form>
      <v-col cols="12">
        <v-radio-group
          v-model="goal.home"
          row
          hide-details
          @change="clearNames"
        >
          <v-radio
            :label="match.home"
            :value="true"
            color="teal"
          />
          <v-radio
            :label="match.away"
            :value="false"
            color="pink"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <minute-field v-model="minute" />
      </v-col>
      <v-col cols="12">
        <player-select
          v-if="teamGoal"
          v-model="goal.player_id"
          :players="scorerOptions"
          label="Goal Scorer"
          required
        />
        <v-text-field
          v-else
          v-model="goal.player_name"
          v-rules.required
          label="Goal Scorer"
          prepend-icon="mdi-account"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <player-select
          v-if="teamGoal"
          v-model="goal.assist_id"
          :players="assistOptions"
          label="Assisted By"
          icon="mdi-human-greeting"
          :disabled="goal.penalty || goal.own_goal"
          clearable
          hide-details
        />
        <v-text-field
          v-else
          v-model="goal.assisted_by"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          :disabled="goal.penalty || goal.own_goal"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="goal.penalty"
          label="Penalty"
          :disabled="goal.own_goal"
          hide-details
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="goal.own_goal"
          label="Own Goal"
          :disabled="goal.penalty"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { MinuteField, PlayerSelect, TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  const mix = mixins(TeamAccessible, DialogFormable, MatchAccessible)
  const goals = namespace('goals')

  @Component({
    components: {
      MinuteField,
      PlayerSelect,
      TooltipButton
    }
  })
  export default class GoalForm extends mix {
    @goals.Action('CREATE') createGoal
    @goals.Action('UPDATE') updateGoal
    @Prop(Object) record

    goal = {
      home: true, // default to Team side
      player_id: null,
      player_name: '',
      assisted_by: '',
      assist_id: '',
      own_goal: false,
      penalty: false
    }

    get title () {
      return `${this.record ? 'Edit' : 'Record'} Goal`
    }

    get scoredTeam () {
      return this.home ? this.match.home : this.match.away
    }

    get teamGoal () {
      return !this.goal.home ^ this.match.home === this.team.title
    }

    get scorerOptions () {
      return this.unsubbedPlayers.filter(cap =>
        cap.player_id !== this.goal.assist_id
      )
    }

    get assistOptions () {
      return this.unsubbedPlayers.filter(cap =>
        cap.player_id !== this.goal.player_id
      )
    }

    @Watch('dialog')
    setGoal (val) {
      if (val && this.record) {
        this.goal = pick(this.record, [
          'id',
          'home',
          'player_id',
          'player_name',
          'assisted_by',
          'assist_id',
          'own_goal',
          'penalty'
        ])
        this.minute = this.record.minute
      }
    }

    clearNames () {
      this.goal.player_id = null
      this.goal.player_name = ''
      this.clearAssistedBy(true)
    }

    @Watch('goal.penalty')
    @Watch('goal.own_goal')
    clearAssistedBy (val) {
      if (val) {
        this.goal.assist_id = null
        this.goal.assisted_by = null
      }
    }

    async submit () {
      const goal = {
        ...this.goal,
        minute: this.minute
      }

      if (this.record) {
        await this.updateGoal(goal)
      } else {
        await this.createGoal({
          matchId: this.match.id,
          goal
        })
      }
    }
  }
</script>
