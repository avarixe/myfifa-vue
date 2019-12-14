<template>
  <v-timeline-item
    :color="color"
    :icon="`mdi-${icon}`"
    fill-dot
  >
    <h2 :class="`headline font-weight-light my-0 ${color}--text`">
      {{ event.minute || lastMinute }}"

      <span :class="`caption text-truncate ${captionColor}--text`">
        {{ caption }}
      </span>

      <record-form
        v-if="!readonly"
        :record="event"
        :match="match"
        :type="type"
        color="orange"
      >
        <template #default="{ on }">
          <tooltip-button
            :label="`Edit ${type}`"
            icon="mdi-pencil"
            color="orange"
            small
            :on="on"
          />
        </template>
      </record-form>

      <record-remove
        v-if="!readonly"
        :record="event"
        :store="store"
        :label="title"
      />
    </h2>

    <timeline-content
      :item="event"
      :type="type"
    />
  </v-timeline-item>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { RecordRemove, TooltipButton } from '@/helpers'
  import RecordForm from '@/helpers/RecordForm'
  import TimelineContent from './Content'

  @Component({
    components: {
      RecordForm,
      RecordRemove,
      TimelineContent,
      TooltipButton
    }
  })
  export default class MatchTimelineItem extends Vue {
    @Prop({ type: Object, required: true }) event
    @Prop({ type: Object, required: true }) match
    @Prop(Boolean) readonly

    get type () {
      return this.event.event_type || 'Penalty Shootout'
    }

    get color () {
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
    }

    get icon () {
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
    }

    get title () {
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
    }

    get store () {
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
    }

    get lastMinute () {
      return this.event.extra_time ? 120 : 90
    }

    get caption () {
      if (this.type === 'Penalty Shootout') {
        return 'Penalty Shootout'
      } else {
        return this.event.home
          ? this.match.home
          : this.match.away
      }
    }

    get captionColor () {
      if (this.type === 'Penalty Shootout') {
        return 'indigo'
      } else {
        return this.event.home ? 'teal' : 'pink'
      }
    }
  }
</script>
