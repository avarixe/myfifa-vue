<template>
  <v-timeline-item
    :color="color"
    :icon="`mdi-${icon}`"
    fill-dot
  >
    <h2 :class="`headline font-weight-light my-0 ${color}--text`">
      {{ goal.minute }}"
      <span :class="`caption text-truncate mx-1 ${captionColor}--text`">
        {{ goal.home ? match.home : match.away }}
      </span>
      <template v-if="!readonly">
        <goal-form
          :match="match"
          :record="goal"
        >
          <template #default="{ on }">
            <tooltip-button
              label="Edit Goal"
              icon="mdi-pencil"
              color="orange"
              small
              :on="on"
            />
          </template>
        </goal-form>
        <record-remove
          :record="goal"
          store="goals"
          :label="goalType"
        />
      </template>
    </h2>
    {{ goalType }} scored by <b>{{ goal.player_name }}</b>
    <span v-if="goal.assisted_by">
      (assisted by <b>{{ goal.assisted_by }}</b>)
    </span>
  </v-timeline-item>
</template>

<script>
  import GoalForm from '@/components/Goal/Form'

  export default {
    name: 'GoalEvent',
    components: {
      GoalForm
    },
    props: {
      match: { type: Object, required: true },
      goal: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      goalType () {
        if (this.goal.penalty) {
          return 'Penalty'
        } else if (this.goal.own_goal) {
          return 'Own Goal'
        } else {
          return 'Goal'
        }
      },
      color () {
        return this.goal.own_goal ? 'blue-grey' : 'blue'
      },
      captionColor () {
        return this.goal.home ? 'teal' : 'pink'
      },
      icon () {
        return this.goal.penalty ? 'alpha-p-circle-outline' : 'soccer'
      }
    }
  }
</script>
