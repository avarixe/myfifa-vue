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
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { GoalFields } from '@/functions/fields'

  export default {
    name: 'GoalForm',
    mixins: [
      TeamAccessible,
      DialogFormable,
      MatchAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      goal: {
        home: true,
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
        return GoalFields(this)
      },
      title () {
        return `${this.record ? 'Edit' : 'Record'} Goal`
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
      },
      teamGoal () {
        return !this.goal.home ^ this.match.home === this.team.title
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
      'goal.assist_id' (val) {
        if (!val && this.teamGoal) {
          this.goal.assisted_by = ''
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
        console.log(`clearAssistedBy `, val)
        if (val) {
          this.goal.assist_id = null
          this.goal.assisted_by = null
        }
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
