<template lang="pug">
  v-timeline-item(
    :color="color"
    :icon="`mdi-${icon}`"
    fill-dot
  )
    h2.headline.font-weight-light.my-0(:class="`${color}--text`")
      | {{ goal.minute }}"
      span.caption.text-truncate.mx-1(:class="`${captionColor}--text`")
        | {{ goal.home ? match.home : match.away }}
      template(v-if="!readonly")
        goal-form(:match="match" :record="goal")
          template(#default="{ on }")
            tooltip-button(
              label="Edit Goal"
              icon="mdi-pencil"
              color="orange"
              small
              :on="on"
            )
        |&nbsp;
        record-remove(
          :record="goal"
          store="goals"
          :label="goalType"
        )
    | {{ goalType }} scored by
    |&nbsp;
    span.font-weight-bold {{ goal.player_name }}
    |&nbsp;
    span(v-if="goal.assisted_by")
      | (assisted by
      |&nbsp;
      span.font-weight-bold {{ goal.assisted_by }}
      | )
</template>

<script>
  import GoalForm from '@/components/Goal/Form'

  export default {
    name: 'GoalEvent',
    components: {
      GoalForm
    },
    props: {
      match: {
        type: Object,
        required: true
      },
      goal: {
        type: Object,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
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
