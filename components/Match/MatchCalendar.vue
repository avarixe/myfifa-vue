<script>
  import { ref, reactive, computed, onMounted, useStore } from '@nuxtjs/composition-api'
  import Vue from 'vue'
  import { useTeam } from '@/composables'

  export default {
    name: 'MatchCalendar',
    setup () {
      const day = ref(new Date())
      const selectedEvent = reactive({ value: {} })
      const selectedElement = ref(null)
      const selectedOpen = ref(false)
      const competitionColors = reactive({})

      const store = useStore()
      const { team } = useTeam()
      const matches = computed(() => {
        return store.$db().model('Match')
          .query()
          .with('team')
          .where('teamId', team.value.id)
          .get()
      })

      const eventColors = [
        'blue',
        'purple',
        'cyan',
        'lime darken-2',
        'teal',
        'indigo',
        'blue-grey'
      ]
      const events = computed(() => {
        return matches.value.map(match => {
          if (!competitionColors[match.competition]) {
            Vue.set(
              competitionColors,
              match.competition,
              eventColors[Object.keys(competitionColors).length % eventColors.length]
            )
          }
          return {
            ...match,
            name: match.stage
              ? `${match.competition} · ${match.stage}`
              : match.competition,
            color: competitionColors[match.competition],
            opponent: match.opponent,
            link: match.link
          }
        })
      })

      onMounted(() => {
        day.value = team.value.currentlyOn
      })

      const viewMatch = ({ nativeEvent, event }) => {
        const open = () => {
          selectedEvent.value = event
          selectedElement.value = nativeEvent.target
          setTimeout(() => {
            selectedOpen.value = true
          }, 10)
        }

        if (selectedOpen.value) {
          selectedOpen.value = false
          setTimeout(open, 10)
        } else {
          open()
        }
      }

      return {
        events,
        team,
        day,
        selectedEvent,
        selectedElement,
        selectedOpen,
        viewMatch
      }
    }
  }
</script>

<template>
  <v-card>
    <v-toolbar
      color="transparent"
      flat
    >
      <v-btn
        outlined
        class="mr-4"
        color="grey darken-2"
        @click="day = team.currentlyOn"
      >
        Today
      </v-btn>
      <v-btn
        icon
        text
        small
        color="grey darken-2"
        @click="$refs.calendar.prev()"
      >
        <v-icon small>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        icon
        text
        small
        color="grey darken-2"
        @click="$refs.calendar.next()"
      >
        <v-icon small>mdi-chevron-right</v-icon>
      </v-btn>
      <v-toolbar-title
        v-if="$refs.calendar"
        class="ml-4"
      >
        {{ $refs.calendar.title }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <div :style="{ overflowX: 'auto' }">
        <v-calendar
          ref="calendar"
          v-model="day"
          type="month"
          :now="team.currentlyOn"
          :events="events"
          event-start="playedOn"
          event-ripple
          :show-month-on-first="false"
          :style="{ minWidth: '700px' }"
          @click:event="viewMatch"
        >
          <template #event="{ event }">
            <div class="pl-1">
              <scroll-text :text="event.name" />
            </div>
          </template>
        </v-calendar>
      </div>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        min-width="300"
        offset-y
        offset-overflow
      >
        <match-card
          :match="selectedEvent.value"
          :title="selectedEvent.value.competition"
          :color="selectedEvent.value.color"
          compact
        />
      </v-menu>
    </v-card-text>
  </v-card>
</template>
