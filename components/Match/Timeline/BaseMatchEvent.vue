<script>
  import { toRefs, computed } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'BaseMatchEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    setup (props) {
      const { match, event } = toRefs(props)

      const { team } = useTeam()
      const teamIsHome = computed(() => {
        if (event.value.type === 'substitution') {
          return match.value.home === team.value.name
        } else {
          return event.value.home
        }
      })

      const itemColor = computed(() => {
        if (event.value.type === 'penalty-shootout') {
          return 'indigo'
        } else {
          return teamIsHome.value ? 'teal' : 'purple'
        }
      })

      const itemTitle = computed(() => {
        if (event.value.type === 'penalty-shootout') {
          return 'Penalty Shootout'
        } else {
          return teamIsHome.value ? match.value.home : match.value.away
        }
      })

      const minute = computed(() => {
        if (event.value.type === 'penalty-shootout') {
          return match.value.extraTime ? 120 : 90
        } else {
          return event.value.minute
        }
      })

      const buttonLabel = computed(() => {
        return event.value.type === 'penalty-shootout'
          ? 'Penalty Shootout'
          : `${event.value.type[0].toUpperCase()}${event.value.type.slice(1)}`
      })

      const store = computed(() => {
        return event.value.type === 'penalty-shootout'
          ? 'penaltyShootout'
          : `${event.value.type}s`
      })

      return {
        teamIsHome,
        itemColor,
        itemTitle,
        minute,
        buttonLabel,
        store
      }
    }
  }
</script>

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
