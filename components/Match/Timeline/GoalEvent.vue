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
        v-text="'mdi-soccer'"
      />
      {{ event.player_name }}
      <span v-if="event.penalty">(P)</span>
      <span v-else-if="event.own_goal">(OG)</span>
    </div>
    <div v-if="event.assisted_by">
      <v-icon
        color="light-blue accent-1"
        small
        left
        v-text="`mdi-human-greeting`"
      />
      {{ event.assisted_by }}
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
        return this.event.own_goal ? 'blue-grey' : 'blue'
      }
    }
  }
</script>
