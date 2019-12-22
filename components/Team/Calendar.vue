<template lang="pug">
  v-row
    v-col.text-left(cols=3)
      v-btn(icon @click="$refs.calendar.prev()")
        v-icon mdi-chevron-left
    v-col.text-center(cols=6)
      v-btn(text) {{ currentMonth }}
    v-col.text-right(cols=3)
      v-btn(icon @click="$refs.calendar.next()")
        v-icon mdi-chevron-right
    v-col(cols=12)
      v-calendar(
        ref="calendar"
        v-model="day"
        type="month"
        :now="team.currently_on"
        :start="team.started_on"
        :show-month-on-first="false"
      )
        template(#day="{ date }")
          v-sheet.pa-1.transparent(
            v-for="match in matchesOn(date)"
            :key="match.id"
            tile
          )
            v-dialog(width="500")
              template(#activator="{ on }")
                a.d-block.text-center(v-on="on")
                  fitty-text(
                    :text="match.opponent"
                    :max-size="14"
                  ) {{ match.opponent }}
              match-card(
                :match="match"
                :title="`${match.home} v ${match.away}`"
                color="light-blue"
              )
</template>

<script>
  import { Match } from '@/models'
  import MatchCard from '@/components/Match/Card'
  import { FittyText } from '@/helpers'
  import { TeamAccessible } from '@/mixins'
  import { format, parseISO } from 'date-fns'

  export default {
    name: 'TeamCalendar',
    components: {
      FittyText,
      MatchCard
    },
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      day: format(new Date(), 'yyyy-MM-dd')
    }),
    computed: {
      currentMonth () {
        return format(parseISO(this.day), 'MMMM yyyy')
      }
    },
    mounted () {
      this.day = this.team.currently_on
    },
    methods: {
      matchesOn (date) {
        return Match
          .query()
          .with('team')
          .where('team_id', this.team.id)
          .where('played_on', date)
          .get()
      }
    }
  }
</script>
