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
            to: this.team.link,
            icon: 'mdi-shield-half-full',
            text: this.team.title,
            exact: true
          },
          {
            to: this.team.linkTo('seasons'),
            icon: 'mdi-trophy',
            text: 'Seasons'
          },
          {
            to: this.team.linkTo('players'),
            icon: 'mdi-account',
            text: 'Players'
          },
          {
            to: this.team.linkTo('matches'),
            icon: 'mdi-soccer-field',
            text: 'Matches'
          },
          {
            to: this.team.linkTo('squads'),
            icon: 'mdi-clipboard-text',
            text: 'Squads'
          },
          {
            to: this.team.linkTo('transfers'),
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
