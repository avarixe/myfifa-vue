<template>
  <base-match-event
    :match="match"
    :event="event"
    :readonly="readonly"
  >
    <v-icon
      :color="color"
      small
      left
      v-text="'mdi-book'"
    />
    {{ event.player_name }}
  </base-match-event>
</template>

<script>
  export default {
    name: 'BookingEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      color () {
        return this.event.red_card ? 'red' : 'amber'
      }
    }
  }
</script>
