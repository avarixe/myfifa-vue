<template>
  <v-navigation-drawer
    id="app-drawer"
    :value="drawer"
    app
    clipped
    mobile-break-point="991"
    @input="setDrawer"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          MyFIFA Manager
        </v-list-item-title>
        <v-list-item-subtitle>
          v{{ version }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list
      v-if="teamId"
      nav
    >
      <team-date-picker menu-class="d-block">
        <template #default="{ on, date }">
          <v-list-item
            v-ripple
            color="accent"
            style="width: 100%"
            v-on="on"
          >
            <v-list-item-action>
              <v-icon>mdi-calendar</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              {{ date | formatDate }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </team-date-picker>

      <v-list-item
        v-for="(link, i) in teamLinks"
        :key="i"
        :to="link.to"
        active-class=""
        exact
      >
        <v-list-item-action>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-title>{{ link.text }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider
      v-if="teamId"
      class="mx-3"
    />

    <v-list nav>
      <v-list-item
        to="/"
        exact
        nuxt
      >
        <v-list-item-action>
          <v-icon>mdi-home</v-icon>
        </v-list-item-action>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <user-form class="d-block">
        <template #default="{ on }">
          <v-list-item v-on="on">
            <v-list-item-action>
              <v-icon>mdi-account-tie</v-icon>
            </v-list-item-action>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
        </template>
      </user-form>

      <v-list-item @click="logUserOut">
        <v-list-item-action>
          <v-icon>mdi-exit-to-app</v-icon>
        </v-list-item-action>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import { Vue, Component, State, Action, namespace } from 'nuxt-property-decorator'
  import Cookie from 'js-cookie'
  import { Team } from '@/models'
  import UserForm from './UserForm'
  import TeamDatePicker from '@/components/Team/DatePicker'

  const app = namespace('app')

  @Component({
    components: {
      TeamDatePicker,
      UserForm
    }
  })
  export default class AppDrawer extends Vue {
    @State version
    @Action logout
    @app.State drawer
    @app.Mutation('SET_DRAWER') setDrawer

    get teamId () {
      return this.$route.params.teamId
    }

    get team () {
      return Team.find(this.teamId)
    }

    get teamName () {
      return this.team.title
    }

    get teamLinks () {
      if (this.teamId) {
        return [
          {
            to: {
              name: 'teams-teamId',
              params: { teamId: this.teamId }
            },
            icon: 'mdi-view-dashboard',
            text: 'Dashboard'
          },
          {
            to: this.linkTo('seasons'),
            icon: 'mdi-trophy',
            text: 'Seasons'
          },
          {
            to: this.linkTo('players'),
            icon: 'mdi-account',
            text: 'Players'
          },
          {
            to: this.linkTo('matches'),
            icon: 'mdi-soccer-field',
            text: 'Matches'
          },
          {
            to: this.linkTo('squads'),
            icon: 'mdi-clipboard-text',
            text: 'Squads'
          }
        ]
      } else {
        return []
      }
    }

    mounted () {
      this.setDrawer(window.innerWidth >= 991)
    }

    async logUserOut () {
      await this.logout()
      Cookie.remove('token')
    }

    linkTo (page) {
      return {
        name: `teams-teamId-${page}`,
        params: { teamId: this.team.id }
      }
    }
  }
</script>
