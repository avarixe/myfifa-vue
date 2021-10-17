<script>
  import { toRef, computed } from '@nuxtjs/composition-api'

  export default {
    name: 'BookingEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    setup (props) {
      const event = toRef(props, 'event')
      const color = computed(() => event.value.redCard ? 'red' : 'amber')

      return { color }
    }
  }
</script>

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
    >
      mdi-book
    </v-icon>
    {{ event.playerName }}
  </base-match-event>
</template>
