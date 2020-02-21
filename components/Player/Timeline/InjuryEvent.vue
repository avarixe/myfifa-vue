<template lang="pug">
  v-timeline-item(
    icon="mdi-ambulance"
    color="pink"
    fill-dot
    right
  )
    template(#opposite)
      span.headline.font-weight-bold.pink--text {{ injury.description }} Injury
      h4.title.font-weight-light.mb-3.pink--text
        | {{ injury.started_on | formatDate }}
        | -
        template(v-if="injury.ended_on")
          | {{ injury.ended_on | formatDate }}
        template(v-else)
          | Present
    v-card(dense flat)
      v-card-title.py-0(v-if="dense")
        .pink--text
          span.title.font-weight-bold {{ injury.description }} Injury
          h4.body-2.font-weight-light.mb-3
            | {{ formatDate(injury.started_on) }}
            | -
            template(v-if="injury.ended_on")
              | {{ injury.ended_on | formatDate }}
            template(v-else)
              | Present
      v-card-text.py-0
        table
          tbody
            tr
              td.font-weight-bold Duration
              td.pl-1 Injured for {{ length }}
      v-card-actions
        injury-form(:player="player" :record="injury")
          template(#default="{ on }")
            v-btn(
              text
              small
              color="orange"
              v-on="on"
            ) Edit
</template>

<script>
  import { formatDistance, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'
  import InjuryForm from '@/components/Injury/Form'

  export default {
    name: 'InjuryEvent',
    components: {
      InjuryForm
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      injury: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    computed: {
      length () {
        return formatDistance(
          parseISO(this.injury.ended_on || this.team.currently_on),
          parseISO(this.injury.started_on)
        )
      }
    }
  }
</script>
