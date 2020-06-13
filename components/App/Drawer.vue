<template>
  <v-navigation-drawer
    id="app-drawer"
    :value="drawer"
    app
    clipped
    mobile-breakpoint="991"
    @input="setDrawer"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">MyFIFA Manager</v-list-item-title>
        <v-list-item-subtitle>v{{ version }}</v-list-item-subtitle>
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
            <v-list-item-title>{{ date | formatDate }}</v-list-item-title>
          </v-list-item>
        </template>
      </team-date-picker>
      <v-list-item
        v-for="(link, i) in teamLinks"
        :key="i"
        :to="link.to"
        active-class=""
        :exact="link.exact"
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
      <settings-form class="d-block">
        <template #default="{ on }">
          <v-list-item v-on="on">
            <v-list-item-action>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-action>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </template>
      </settings-form>
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
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { TeamAccessible } from '@/mixins'
  import SettingsForm from './SettingsForm'
  import TeamDatePicker from '@/components/Team/DatePicker'
  import UserForm from './UserForm'

  export default {
    name: 'AppDrawer',
    components: {
      SettingsForm,
      TeamDatePicker,
      UserForm
    },
    mixins: [
      TeamAccessible
    ],
    computed: {
      ...mapState([
        'version'
      ]),
      ...mapState('app', [
        'drawer'
      ]),
      teamId () {
        return this.$route.params.teamId
      },
      teamLinks () {
        if (this.teamId) {
          return [
            {
              to: {
                name: 'teams-teamId',
                params: { teamId: this.teamId }
              },
              exact: true,
              icon: 'mdi-view-dashboard',
              text: 'Dashboard'
            },
            {
              to: {
                name: 'teams-teamId-seasons-season',
                params: { season: this.season }
              },
              icon: 'mdi-trophy',
              text: 'Season'
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
    },
    mounted () {
      this.setDrawer(window.innerWidth >= 991)
    },
    methods: {
      ...mapMutations('app', {
        setDrawer: 'SET_DRAWER'
      }),
      ...mapActions({
        logout: 'LOGOUT'
      }),
      async logUserOut () {
        await this.logout()
      }
    }
  }
</script>
