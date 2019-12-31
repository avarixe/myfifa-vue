<template lang="pug">
  dialog-form(
    v-model="dialog"
    title-icon="mdi-soccer"
    :title="title"
    :submit="submit"
    :color="color"
  )
    template(#activator="{ on }")
      slot(:on="on")
        tooltip-button(
          label="Goal"
          icon="mdi-soccer"
          color="blue"
          :on="on"
        )
    template(#form)
      dynamic-fields(:object="goal" :fields="fields")
        template(#field.minute)
          minute-field(v-model="minute")
        template(#field.player_id)
          player-select(
            v-model="goal.player_id"
            :players="scorerOptions"
            label="Goal Scorer"
            required
          )
        template(#field.assist_id)
          player-select(
            v-model="goal.assist_id"
            :players="assistOptions"
            label="Assisted By"
            icon="mdi-human-greeting"
            :disabled="goal.penalty || goal.own_goal"
            clearable
            hide-details
          )
        template(#field.penalty)
          v-checkbox(
            v-model="goal.penalty"
            label="Penalty"
            :disabled="goal.own_goal"
            hide-details
          )
        template(#field.own_goal)
          v-checkbox(
            v-model="goal.own_goal"
            label="Own Goal"
            :disabled="goal.penalty"
            hide-details
          )
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  export default {
    name: 'GoalForm',
    mixins: [
      TeamAccessible,
      DialogFormable,
      MatchAccessible
    ],
    props: {
      record: {
        type: Object,
        default: null
      }
    },
    data: () => ({
      goal: {
        home: true, // default to Team side
        player_id: null,
        player_name: '',
        assisted_by: '',
        assist_id: '',
        own_goal: false,
        penalty: false
      }
    }),
    computed: {
      fields () {
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
          { slot: 'penalty' },
          { slot: 'own_goal' }
        ]
      },
      title () {
        return `${this.record ? 'Edit' : 'Record'} Goal`
      },
      scoredTeam () {
        return this.home ? this.match.home : this.match.away
      },
      teamGoal () {
        return !this.goal.home ^ this.match.home === this.team.title
      },
      scorerOptions () {
        return this.unsubbedPlayers.filter(cap =>
          cap.player_id !== this.goal.assist_id
        )
      },
      assistOptions () {
        return this.unsubbedPlayers.filter(cap =>
          cap.player_id !== this.goal.player_id
        )
      }
    },
    watch: {
      dialog (val) {
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
      },
      'goal.penalty' (val) {
        this.clearAssistedBy(val)
      },
      'goal.own_goal' (val) {
        this.clearAssistedBy(val)
      }
    },
    methods: {
      ...mapActions('goals', {
        createGoal: 'CREATE',
        updateGoal: 'UPDATE'
      }),
      clearAssistedBy (val) {
        if (val) {
          this.goal.assist_id = null
          this.goal.assisted_by = null
        }
      },
      clearNames () {
        this.goal.player_id = null
        this.goal.player_name = ''
        this.clearAssistedBy(true)
      },
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
  }
</script>
