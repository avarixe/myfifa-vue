<template>
  <v-bottom-navigation
    app
    grow
  >
    <v-btn
      v-for="(link, i) in links"
      :key="i"
      :to="link.to"
      nuxt
      :exact="link.exact"
    >
      <span>{{ link.text }}</span>
      <v-icon>{{ link.icon }}</v-icon>
    </v-btn>
    <team-forms-menu />
  </v-bottom-navigation>
</template>

<script>
  export default {
    name: 'TeamNavigator',
    computed: {
      teamId () {
        return parseInt(this.$route.params.teamId)
      },
      team () {
        return this.$store.$db().model('Team').find(this.teamId)
      },
      links () {
        return [
          {
            text: 'Dashboard',
            icon: 'mdi-view-dashboard',
            to: {
              name: 'teams-teamId',
              params: { teamId: this.teamId }
            },
            exact: true
          },
          {
            text: 'Players',
            icon: 'mdi-run',
            to: this.team.linkTo('players')
          },
          {
            text: 'Matches',
            icon: 'mdi-soccer-field',
            to: this.team.linkTo('matches')
          },
          {
            text: 'Squads',
            icon: 'mdi-clipboard-text',
            to: this.team.linkTo('squads')
          }
        ]
      }
    }
  }
</script>
