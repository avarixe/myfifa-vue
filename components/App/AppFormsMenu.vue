<template>
  <v-menu
    :close-on-content-click="false"
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
    <v-list dense>
      <template v-if="team">
        <player-form>
          <template #default="{ on }">
            <v-list-item v-on="on">
              <v-list-item-avatar>
                <v-icon>mdi-account-plus</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>New Player</v-list-item-content>
            </v-list-item>
          </template>
        </player-form>
        <match-form>
          <template #default="{ on }">
            <v-list-item v-on="on">
              <v-list-item-avatar>
                <v-icon>mdi-soccer-field</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>New Match</v-list-item-content>
            </v-list-item>
          </template>
        </match-form>
        <squad-form>
          <template #default="{ on }">
            <v-list-item v-on="on">
              <v-list-item-avatar>
                <v-icon>mdi-clipboard-plus</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>New Squad</v-list-item-content>
            </v-list-item>
          </template>
        </squad-form>
        <competition-form>
          <template #default="{ on }">
            <v-list-item v-on="on">
              <v-list-item-avatar>
                <v-icon>mdi-trophy</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>New Competition</v-list-item-content>
            </v-list-item>
          </template>
        </competition-form>
      </template>
      <v-divider />
      <team-form>
        <template #default="{ on }">
          <v-list-item v-on="on">
            <v-list-item-avatar>
              <v-icon>mdi-shield-plus</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>New Team</v-list-item-content>
          </v-list-item>
        </template>
      </team-form>
    </v-list>
  </v-menu>
</template>

<script>
  import { Team } from '@/models'

  export default {
    name: 'AppFormsMenu',
    computed: {
      team () {
        return this.$route.params.teamId && Team.find(this.$route.params.teamId)
      },
      links () {
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
  }
</script>
