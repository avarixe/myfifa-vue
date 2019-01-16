<template>
  <v-menu
    v-model="calendar"
    :close-on-content-click="false"
    transition="scale-transition"
    origin="top left"
    
  >
    <v-list-tile
      v-ripple
      slot="activator"
      color="accent"
      class="v-list-item"
      avatar
      style="width: 100%"
    >
      <v-list-tile-action>
        <v-icon>mdi-calendar</v-icon>
      </v-list-tile-action>
      <v-list-tile-text>
        {{ $_format(currentDate, 'MMM DD, YYYY') }}
      </v-list-tile-text>
    </v-list-tile>          

    <v-date-picker
      v-model="currentDate"
      color="accent"
      :min="seasonStart"
      :max="seasonEnd"
      @input="calendar = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [ TeamAccessible ],
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
          await this.$store.dispatch('entities/teams/UPDATE', {
            id: this.team.id,
            current_date: val
          })
          this.calendar = false
        }
      }
    }
  }
</script>
