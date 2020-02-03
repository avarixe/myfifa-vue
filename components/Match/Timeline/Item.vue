<template lang="pug">
  v-timeline-item(
    :color="color"
    :icon="`mdi-${icon}`"
    fill-dot
  )
    h2.headline.font-weight-light.my-0(:class="`${color}--text`")
      | {{ event.minute || lastMinute }}"
      |&nbsp;
      span.caption.text-truncate(:class="`${captionColor}--text`") {{ caption }}
      |&nbsp;
      template(v-if="!readonly")
        record-form(
          :record="event"
          :match="match"
          :type="type"
          color="orange"
        )
          template(#default="{ on }")
            tooltip-button(
              :label="`Edit ${type}`"
              icon="mdi-pencil"
              color="orange"
              small
              :on="on"
            )
        |&nbsp;
        record-remove(
          :record="event"
          :store="store"
          :label="title"
        )
    timeline-content(:item="event" :type="type")
</template>

<script>
  import TimelineContent from './Content'

  export default {
    name: 'MatchTimelineItem',
    components: {
      TimelineContent
    },
    props: {
      event: {
        type: Object,
        required: true
      },
      match: {
        type: Object,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      type () {
        return this.event.event_type || 'Penalty Shootout'
      },
      color () {
        switch (this.type) {
          case 'Goal':
            return this.event.own_goal ? 'blue-grey' : 'blue'
          case 'Booking':
            return this.event.red_card ? 'red' : 'amber'
          case 'Substitution':
            return this.event.injury ? 'pink' : 'green'
          case 'Penalty Shootout':
            return 'indigo'
          default:
            return ''
        }
      },
      icon () {
        switch (this.type) {
          case 'Goal':
            return this.event.penalty ? 'alpha-p-circle-outline' : 'soccer'
          case 'Booking':
            return 'book'
          case 'Substitution':
            return this.event.injury ? 'ambulance' : 'repeat'
          case 'Penalty Shootout':
            return 'human'
          default:
            return ''
        }
      },
      title () {
        switch (this.type) {
          case 'Goal':
            if (this.event.own_goal) {
              return 'Own Goal'
            } else if (this.event.penalty) {
              return 'Penalty'
            } else {
              return 'Goal'
            }
          default:
            return this.type
        }
      },
      store () {
        switch (this.type) {
          case 'Goal':
            return 'goals'
          case 'Booking':
            return 'bookings'
          case 'Substitution':
            return 'substitutions'
          case 'Penalty Shootout':
            return 'penaltyShootout'
          default:
            return ''
        }
      },
      lastMinute () {
        return this.event.extra_time ? 120 : 90
      },
      caption () {
        if (this.type === 'Penalty Shootout') {
          return 'Penalty Shootout'
        } else {
          return this.event.home
            ? this.match.home
            : this.match.away
        }
      },
      captionColor () {
        if (this.type === 'Penalty Shootout') {
          return 'indigo'
        } else {
          return this.event.home ? 'teal' : 'pink'
        }
      }
    }
  }
</script>
