<template>
  <v-toolbar fixed dense>
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

    <v-tooltip bottom>
      <v-btn
        slot="activator"
        :to="{ name: 'teams-id', params: { id: team.id } }"
        active-class="primary--text"
        nuxt
        exact
        icon>
        <v-icon>mdi-trophy</v-icon>
      </v-btn>
      Dashboard
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn
        slot="activator"
        :to="{ name: 'teams-id-players', params: { id: team.id } }"
        active-class="primary--text"
        nuxt
        exact
        icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      Players
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn
        slot="activator"
        :to="{ name: 'teams-id-matches', params: { id: team.id } }"
        active-class="primary--text"
        nuxt
        exact
        icon>
        <v-icon>mdi-soccer-field</v-icon>
      </v-btn>
      Matches
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn
        slot="activator"
        :to="{ name: 'teams-id-squads', params: { id: team.id } }"
        active-class="primary--text"
        nuxt
        exact
        icon>
        <v-icon>mdi-clipboard-text</v-icon>
      </v-btn>
      Squads
    </v-tooltip>

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
    top: 48px;
    background-color: rgba(255,255,255, 0.75);
  }

  .v-toolbar__title {
    text-transform: uppercase;
  }
</style>
