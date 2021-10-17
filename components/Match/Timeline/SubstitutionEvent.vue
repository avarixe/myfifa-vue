<script>
  import { toRef, computed } from '@nuxtjs/composition-api'

  export default {
    name: 'SubstitutionEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    setup (props) {
      const event = toRef(props, 'event')
      const color = computed(() => event.value.injury ? 'pink' : 'orange')
      const icon = computed(() => event.value.injury ? 'ambulance' : 'subdirectory-arrow-left')

      return {
        color,
        icon
      }
    }
  }
</script>

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
        mdi-{{ icon }}
      </v-icon>
      {{ event.playerName }}
    </div>
    <div>
      <v-icon
        color="green"
        small
        left
      >
        mdi-subdirectory-arrow-right
      </v-icon>
      {{ event.replacedBy }}
    </div>
  </base-match-event>
</template>
