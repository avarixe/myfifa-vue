<script>
  import { toRef, computed, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'CapView',
    props: {
      cap: { type: Object, required: true },
      match: { type: Object, required: true }
    },
    setup (props) {
      const store = useStore()
      const cap = toRef(props, 'cap')
      const player = computed(() =>
        store.$db().model('Player').find(cap.value.playerId)
      )

      return { player }
    }
  }
</script>

<template>
  <div>
    <div class="font-weight-bold">{{ cap.pos }}</div>
    <scroll-text
      :text="player.name"
      :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
    />
    <cap-events
      :cap="cap"
      :match="match"
    />
  </div>
</template>
