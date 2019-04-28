<template>
  <v-menu
    v-model="calendar"
    :close-on-content-click="false"
    transition="scale-transition"
    origin="top left"
  >
    <template #activator="{ on }">
      <v-list-tile
        v-ripple
        v-on="on"
        color="accent"
        class="v-list-item"
        avatar
        style="width: 100%"
      >
        <v-list-tile-action>
          <v-icon>mdi-calendar</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>{{ $_format(currentDate, 'MMM DD, YYYY') }}</v-list-tile-title>
      </v-list-tile>
    </template>

    <v-date-picker
      v-model="currentDate"
      color="accent"
      :min="seasonStart"
      :max="seasonEnd"
      @input="calendar = false"
    />
  </v-menu>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    mixins: [
      TeamAccessible
    ],
    data () {
      return {
        calendar: false,
        currentDate: this.$_format(new Date())
      }
    },
    watch: {
      team: {
        immediate: true,
        handler (val) {
          this.currentDate = this.team.current_date
        }
      },
      async currentDate (val, oldVal) {
        if (oldVal) {
          await this.$store.dispatch('teams/UPDATE', {
            id: this.team.id,
            current_date: val
          })
          this.calendar = false
        }
      }
    }
  }
</script>
