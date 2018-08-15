<template>
  <v-toolbar fixed dense>
    <v-icon>people</v-icon>
    <v-toolbar-title class="body-2">
      {{ team.title }}
    </v-toolbar-title>

    <v-menu
      v-model="calendar"
      :close-on-content-click="false"
      open-on-hover
      transition="scale-transition"
      origin="top left">
      <v-btn
        slot="activator"
        color="blue-grey"
        dark>
        {{ $_format(currentDate, 'MMM DD, YYYY') }}
      </v-btn>
      <v-date-picker
        v-model="currentDate"
        color="blue-grey"
        :min="seasonStart"
        :max="seasonEnd"
        fixed
      ></v-date-picker>
    </v-menu>
  </v-toolbar>
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
      async currentDate (val, oldVal) {
        if (oldVal) {
          await this.update({ id: this.team.id, current_date: val })
          this.calendar = false
        }
      }
    },
    methods: mapActions('team', [ 'update' ])
  }
</script>

<style scoped>
  .v-toolbar {
    top: 64px;
    background-color: rgba(255,255,255, 0.75);
  }

  .v-toolbar__title {
    text-transform: uppercase;
  }

  @media only screen and (max-width: 959px) {
    .v-toolbar {
      top: 48px;
    }
  }
</style>
