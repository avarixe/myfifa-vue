<template>
  <v-bottom-navigation
    :value="$route.name"
    app
    grow
  >
    <v-btn
      v-for="(link, i) in links"
      :key="i"
      :value="link.to.name"
      @click="$router.push(link.to)"
    >
      <span>{{ link.text }}</span>
      <v-icon>{{ link.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
  import TeamDatePicker from '@/components/Team/TeamDatePicker'

  export default {
    components: {
      TeamDatePicker
    },
    computed: {
      teamId () {
        return this.$route.params.teamId
      },
      links () {
        if (this.teamId) {
          return [
            {
              to: {
                name: 'teams-teamId',
                params: { teamId: this.teamId }
              },
              icon: 'mdi-shield-half-full',
              text: 'Dashboard'
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
  }
</script>
