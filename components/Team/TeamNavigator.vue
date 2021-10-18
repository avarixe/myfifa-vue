<script>
  import { computed } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'TeamNavigator',
    setup () {
      const { teamId } = useTeam()
      const links = computed(() => [
        {
          text: 'Dashboard',
          icon: 'mdi-view-dashboard',
          to: {
            name: 'teams-teamId',
            params: { teamId: teamId.value }
          },
          exact: true
        },
        {
          text: 'Players',
          icon: 'mdi-run',
          to: {
            name: 'teams-teamId-players',
            params: { teamId: teamId.value }
          },
          exact: true
        },
        {
          text: 'Matches',
          icon: 'mdi-soccer-field',
          to: {
            name: 'teams-teamId-matches',
            params: { teamId: teamId.value }
          },
          exact: true
        },
        {
          text: 'Squads',
          icon: 'mdi-clipboard-text',
          to: {
            name: 'teams-teamId-squads',
            params: { teamId: teamId.value }
          },
          exact: true
        }
      ])

      return { links }
    }
  }
</script>

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
