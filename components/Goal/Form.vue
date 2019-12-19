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
      <dynamic-fields
        :object="goal"
        :fields="fields"
      >
        <template #field.minute>
          <minute-field v-model="minute" />
        </template>
        <template #field.player_id>
          <player-select
            v-model="goal.player_id"
            :players="scorerOptions"
            label="Goal Scorer"
            required
          />
        </template>
        <template #field.assist_id>
          <player-select
            v-model="goal.assist_id"
            :players="assistOptions"
            label="Assisted By"
            icon="mdi-human-greeting"
            :disabled="goal.penalty || goal.own_goal"
            clearable
            hide-details
          />
        </template>
      </dynamic-fields>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import {
    DynamicFields,
    MinuteField,
    PlayerSelect,
    TooltipButton
  } from '@/helpers'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  const mix = mixins(TeamAccessible, DialogFormable, MatchAccessible)
  const goals = namespace('goals')

  @Component({
    components: {
      DynamicFields,
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

    get fields () {
      let fields = [
        {
          type: 'radio',
          attribute: 'home',
          items: [
            { label: this.match.home, value: true, color: 'teal' },
            { label: this.match.away, value: false, color: 'pink' }
          ],
          hideDetails: true,
          onUpdate: this.clearNames
        },
        { slot: 'minute' }
      ]

      if (this.teamGoal) {
        fields.push({ slot: 'player_id' })
        fields.push({ slot: 'assist_id' })
      } else {
        fields.push({
          type: 'string',
          attribute: 'player_name',
          label: 'Goal Scorer',
          prependIcon: 'mdi-account',
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        })
        fields.push({
          type: 'string',
          attribute: 'assisted_by',
          label: 'Assisted By',
          prependIcon: 'mdi-human-greeting',
          hideDetails: true,
          disabled: this.goal.penalty || this.goal.own_goal,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        })
      }

      return [
        ...fields,
        {
          type: 'checkbox',
          attribute: 'penalty',
          label: 'Penalty',
          disabled: this.goal.own_goal,
          hideDetails: true
        },
        {
          type: 'checkbox',
          attribute: 'own_goal',
          label: 'Own Goal',
          disabled: this.goal.penalty,
          hideDetails: true
        }
      ]
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

    @Watch('goal.penalty')
    @Watch('goal.own_goal')
    clearAssistedBy (val) {
      if (val) {
        this.goal.assist_id = null
        this.goal.assisted_by = null
      }
    }

    clearNames () {
      console.log('in clearNames')
      this.goal.player_id = null
      this.goal.player_name = ''
      this.clearAssistedBy(true)
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
