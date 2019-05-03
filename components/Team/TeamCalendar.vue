<template>
  <v-layout wrap>
    <v-flex
      xs3
      class="text-xs-left"
    >
      <v-btn
        icon
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-flex>
    <v-flex
      xs6
      class="text-xs-center"
    >
      <v-btn flat>{{ currentMonth }}</v-btn>
    </v-flex>
    <v-flex
      xs3
      class="text-xs-right"
    >
      <v-btn
        icon
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-flex>

    <v-flex
      xs12
    >
      <v-calendar
        ref="calendar"
        v-model="day"
        type="month"
        :now="team.current_date"
        :start="team.start_date"
        :show-month-on-first="false"
      >
      </v-calendar>
    </v-flex>
  </v-layout>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    mixins: [
      TeamAccessible
    ],
    data () {
      return {
        day: this.$_format(new Date(), 'YYYY-MM-DD')
      }
    },
    computed: {
      currentMonth () {
        const date = this.$_parse(this.day)
        return this.$_format(date, 'MMMM YYYY')
      }
    },
    mounted () {
      this.day = this.team.current_date
    }
  }
</script>
