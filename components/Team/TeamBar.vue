<template>
  <v-toolbar fixed dense>
    <v-menu bottom class="hidden-sm-and-up">
      <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
      <v-list>
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.path"
          nuxt
          exact>
          <v-list-tile-avatar>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ link.text }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <v-toolbar-title class="body-2">
      {{ team.title }}
    </v-toolbar-title>

    <v-menu
      v-model="calendar"
      :close-on-content-click="false"
      transition="scale-transition"
      origin="top left">
      <v-btn
        slot="activator"
        color="accent">
        {{ $_format(currentDate, 'MMM DD, YYYY') }}
      </v-btn>
      <v-date-picker
        v-model="currentDate"
        color="accent"
        :min="seasonStart"
        :max="seasonEnd"
        @input="calendar = false"
      ></v-date-picker>
    </v-menu>

    <v-tooltip
      v-for="(link, i) in links"
      :key="i"
      class="hidden-xs-only"
      bottom>
      <v-btn
        slot="activator"
        :to="link.path"
        active-class="primary--text"
        nuxt
        exact
        icon>
        <v-icon>{{ link.icon }}</v-icon>
      </v-btn>
      {{ link.text }}
    </v-tooltip>

    <v-spacer></v-spacer>

    <v-btn
      class="hidden-xs-only"
      flat
      @click="$router.back()">
      Back
    </v-btn>
  </v-toolbar>
</template>

<script>
  import { mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [ TeamAccessible ],
    data () {
      return {
        calendar: false,
        currentDate: this.$_format(new Date())
      }
    },
    computed: {
      links () {
        return [
          { text: 'Seasons', icon: 'mdi-trophy',         path: { name: 'teams-teamId-seasons', params: { teamId: this.team.id } } },
          { text: 'Players', icon: 'mdi-account',        path: { name: 'teams-teamId-players', params: { teamId: this.team.id } } },
          { text: 'Matches', icon: 'mdi-soccer-field',   path: { name: 'teams-teamId-matches', params: { teamId: this.team.id } } },
          { text: 'Squads',  icon: 'mdi-clipboard-text', path: { name: 'teams-teamId-squads',  params: { teamId: this.team.id } } }
        ]
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
          await this.update({ id: this.team.id, current_date: val })
          this.calendar = false
        }
      }
    },
    methods: mapActions('entities/teams', {
      update: 'UPDATE'
    })
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
