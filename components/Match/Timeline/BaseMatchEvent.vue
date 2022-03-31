<template>
  <v-timeline-item
    :color="itemColor"
    fill-dot
  >
    <template #icon>
      <v-sheet
        dark
        color="transparent"
      >
        {{ minute }}'
      </v-sheet>
    </template>
    <h2 class="font-weight-light my-0">
      <span :class="`text-caption text-truncate mx-1 ${itemColor}--text`">
        {{ itemTitle }}
      </span>
      <template v-if="!readonly">
        <component
          :is="`${event.type}-form`"
          :match="match"
          :record="event"
        >
          <template #activator="{ on }">
            <tooltip-button
              icon="mdi-pencil"
              color="orange"
              :label="`Edit ${buttonLabel}`"
              :on="on"
            />
          </template>
        </component>
        <record-remove
          :record="event"
          :store="store"
          :label="buttonLabel"
        />
      </template>
    </h2>

    <slot />
  </v-timeline-item>
</template>

<script>
  export default {
    name: 'BaseMatchEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      teamIsHome () {
        if (this.event.type === 'substitution') {
          const team = this.$store.$db().model('Team')
            .find(this.$route.query.teamId)
          return team.name === this.match.home
        } else {
          return this.event.home
        }
      },
      itemColor () {
        if (this.event.type === 'penalty-shootout') {
          return 'indigo'
        } else {
          return this.teamIsHome ? 'teal' : 'purple'
        }
      },
      itemTitle () {
        if (this.event.type === 'penalty-shootout') {
          return 'Penalty Shootout'
        } else {
          return this.teamIsHome ? this.match.home : this.match.away
        }
      },
      minute () {
        if (this.event.type === 'penalty-shootout') {
          return this.match.extraTime ? 120 : 90
        } else {
          return this.event.minute
        }
      },
      buttonLabel () {
        return this.event.type === 'penalty-shootout'
          ? 'Penalty Shootout'
          : `${this.event.type[0].toUpperCase()}${this.event.type.slice(1)}`
      },
      store () {
        return this.event.type === 'penalty-shootout'
          ? 'penaltyShootout'
          : `${this.event.type}s`
      }
    }
  }
</script>
