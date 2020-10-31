<template>
  <v-timeline-item
    :color="teamColor"
    fill-dot
  >
    <template #icon>
      {{ goal.minute }}'
    </template>
    <h2 class="font-weight-light my-0">
      <span :class="`text-caption text-truncate mx-1 ${teamColor}--text`">
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
    <div>
      <v-icon
        :color="color"
        small
        left
      >
        mdi-{{ icon }}
      </v-icon>
      {{ goal.player_name }}
    </div>
    <div v-if="goal.assisted_by">
      <v-icon
        color="light-blue accent-1"
        small
        left
      >
        mdi-human-greeting
      </v-icon>
      {{ goal.assisted_by }}
    </div>
  </v-timeline-item>
</template>

<script>
  export default {
    name: 'GoalEvent',
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
      teamColor () {
        return this.goal.home ? 'teal' : 'purple'
      },
      color () {
        return this.goal.own_goal ? 'blue-grey' : 'blue'
      },
      icon () {
        if (this.goal.penalty) {
          return 'target'
        } else if (this.goal.own_goal) {
          return 'alert-circle'
        } else {
          return 'soccer'
        }
      }
    }
  }
</script>
