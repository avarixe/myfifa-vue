<template>
  <v-bottom-navigation
    app
    grow
  >
    <team-date-picker
      v-if="teamId"
      origin="bottom left"
      menu-class="d-flex"
    >
      <template #default="{ on, date }">
        <v-btn v-on="on">
          <span>{{ $_format(date, 'MMM DD, YYYY') }}</span>
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
      </template>
    </team-date-picker>

    <v-btn
      v-for="(link, i) in links"
      :key="i"
      :value="link.to.name"
      :to="link.to"
      nuxt
      :exact="link.exact"
    >
      <span>{{ link.text }}</span>
      <v-icon>{{ link.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
  import { Vue, Component } from 'nuxt-property-decorator'
  import { Team } from '@/models'
  import TeamDatePicker from '@/components/Team/DatePicker'

  @Component({
    components: {
      TeamDatePicker
    }
  })
  export default class TeamBottomNavigation extends Vue {
    get teamId () {
      return this.$route.params.teamId
    }

    get team () {
      return Team.find(this.teamId)
    }

    get links () {
      if (this.teamId) {
        return [
          {
            to: {
              name: 'teams-teamId',
              params: { teamId: this.teamId }
            },
            icon: 'mdi-shield-half-full',
            text: this.team.title,
            exact: true
          },
          {
            to: {
              name: 'teams-teamId-seasons',
              params: { teamId: this.teamId }
            },
            icon: 'mdi-trophy',
            text: 'Seasons'
          },
          {
            to: {
              name: 'teams-teamId-players',
              params: { teamId: this.teamId }
            },
            icon: 'mdi-account',
            text: 'Players'
          },
          {
            to: {
              name: 'teams-teamId-matches',
              params: { teamId: this.teamId }
            },
            icon: 'mdi-soccer-field',
            text: 'Matches'
          },
          {
            to: {
              name: 'teams-teamId-squads',
              params: { teamId: this.teamId }
            },
            icon: 'mdi-clipboard-text',
            text: 'Squads'
          },
          {
            to: {
              name: 'teams-teamId-transfers',
              params: { teamId: this.teamId }
            },
            icon: 'mdi-airplane-takeoff',
            text: 'Transfers'
          }
        ]
      } else {
        return []
      }
    }
  }
</script>
