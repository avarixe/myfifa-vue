<template lang="pug">
    v-timeline-item(
      color="primary"
      icon="mdi-plus"
      fill-dot
    )
      v-card
</template>

<script>
  import { MatchAccessible, TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchTimelineEventForm',
    mixins: [
      MatchAccessible,
      TeamAccessible
    ]
  }
</script>
