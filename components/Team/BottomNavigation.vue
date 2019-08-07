<template>
  <v-bottom-navigation
    app
    grow
  >
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

  @Component
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
            icon: 'mdi-view-dashboard',
            text: 'Dashboard',
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
          }
        ]
      } else {
        return []
      }
    }
  }
</script>
