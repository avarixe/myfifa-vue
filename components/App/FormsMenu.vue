<template>
  <v-menu
    offset-y
    offset-overflow
  >
    <template #activator="{ on }">
      <v-btn
        icon
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-list
      dense
    >
      <v-list-item
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name, params: link.params }"
        nuxt
      >
        <v-list-item-avatar>
          <v-icon>mdi-{{ link.icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>{{ link.text }}</v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list-item
        :to="{ name: 'teams-new' }"
        nuxt
      >
        <v-list-item-avatar>
          <v-icon>mdi-shield-plus</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>New Team</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  import { Component, Vue } from 'nuxt-property-decorator'
  import { Team } from '@/models'

  @Component
  export default class AppFormsMenu extends Vue {
    newTeamLink = {
      text: 'New Team',
      icon: 'shield-plus',
      name: 'teams-new'
    }

    get team () {
      return this.$route.params.teamId && Team.find(this.$route.params.teamId)
    }

    get links () {
      if (this.team) {
        return [
          {
            text: 'New Player',
            icon: 'account-plus',
            name: 'teams-teamId-players-new',
            params: { teamId: this.team.id }
          },
          {
            text: 'New Match',
            icon: 'soccer-field',
            name: 'teams-teamId-matches-new',
            params: { teamId: this.team.id }
          },
          {
            text: 'New Squad',
            icon: 'clipboard-plus',
            name: 'teams-teamId-squads-new',
            params: { teamId: this.team.id }
          }
        ]
      } else {
        return []
      }
    }
  }
</script>
