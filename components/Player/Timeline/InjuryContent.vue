<template lang="pug">
  table
    tbody
      tr
        td.font-weight-bold Duration
        td.pl-1 Injured for {{ length }}
</template>

<script>
  import { formatDistance, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'InjuryContent',
    mixins: [
      TeamAccessible
    ],
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      injury () {
        return this.item.data
      },
      length () {
        return formatDistance(
          parseISO(this.injury.ended_on || this.team.currently_on),
          parseISO(this.injury.started_on)
        )
      }
    }
  }
</script>
