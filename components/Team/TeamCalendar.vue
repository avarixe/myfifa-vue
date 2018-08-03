<template>
  <v-menu
    slot="activator"
    v-model="calendar"
    :close-on-content-click="false"
    lazy
    transition="scale-transition"
    origin="bottom right"
    offset-y
    offset-overflow>
    <v-btn
      slot="activator"
      fab
      icon
      fixed
      right
      bottom
      color="primary">
      <v-icon>calendar_today</v-icon>
    </v-btn>
    <v-date-picker
      v-model="currentDate"
      color="blue-grey"
      :min="seasonStart"
      :max="seasonEnd"
    ></v-date-picker>
  </v-menu>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: {
      team: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        calendar: false,
        currentDate: this.team && this.team.current_date
      }
    },
    computed: {
      ...mapGetters('team', [
        'seasonStart',
        'seasonEnd'
      ])
    },
    watch: {
      currentDate (val, oldVal) {
        oldVal && this.update({ id: this.team.id, current_date: val })
      }
    },
    methods: mapActions('team', [ 'update' ])
  }
</script>
