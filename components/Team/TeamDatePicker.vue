<script>
  import { ref, computed, watch, useStore } from '@nuxtjs/composition-api'
  import { format, parseISO } from 'date-fns'
  import { useTeam } from '@/composables'

  export default {
    name: 'TeamDatePicker',
    props: {
      menuClass: { type: String, default: 'd-inline-block' },
      origin: { type: String, default: 'top right' }
    },
    setup () {
      const calendar = ref(false)
      const currentDate = ref(format(new Date(), 'yyyy-MM-dd'))

      const formattedDate = computed(() =>
        format(parseISO(currentDate.value), 'MMM dd, yyyy')
      )

      const { team, seasonStart, seasonEnd } = useTeam()
      const currentlyOn = computed(() => team.value.currentlyOn)
      watch(currentlyOn, () => {
        currentDate.value = currentlyOn.value
      })

      watch(currentDate, async (val, oldVal) => {
        if (oldVal) {
          await store.dispatch('teams/update', {
            id: team.value.id,
            attributes: { currentlyOn: val }
          })
          calendar.value = false
        }
      })

      return {
        calendar,
        currentDate,
        formattedDate,
        seasonStart,
        seasonEnd
      }
    }
  }
</script>

<template>
  <v-menu
    v-model="calendar"
    :close-on-content-click="false"
    transition="scale-transition"
    :origin="origin"
    :class="menuClass"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
        :date="currentDate"
      >
        <v-btn
          class="mb-1"
          text
          v-on="on"
        >
          <v-icon left>mdi-calendar</v-icon>
          {{ currentDate | formatDate('MMM dd') }}
        </v-btn>
      </slot>
    </template>
    <v-date-picker
      v-model="currentDate"
      color="cyan"
      :min="seasonStart"
      :max="seasonEnd"
      @input="calendar = false"
    />
  </v-menu>
</template>
