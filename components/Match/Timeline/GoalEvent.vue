<template>
  <base-match-event
    :match="match"
    :event="event"
    :readonly="readonly"
  >
    <div>
      <v-icon
        :color="color"
        small
        left
      >
        mdi-soccer
      </v-icon>
      {{ event.playerName }}
      <span v-if="event.penalty">(P)</span>
      <span v-else-if="event.ownGoal">(OG)</span>
    </div>
    <div v-if="event.assistedBy">
      <v-icon
        color="light-blue accent-1"
        small
        left
      >
        mdi-human-greeting
      </v-icon>
      {{ event.assistedBy }}
    </div>
  </base-match-event>
</template>

<script>
  export default {
    name: 'GoalEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      color () {
        return this.event.ownGoal ? 'blue-grey' : 'blue'
      }
    }
  }
</script>
