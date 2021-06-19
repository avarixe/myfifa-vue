<template>
  <v-navigation-drawer
    id="app-drawer"
    :value="drawer"
    app
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
      <v-list-item
        :disabled="togglingMode"
        @click="toggleMode"
      >
        <v-list-item-action>
          <v-icon>{{ modeIcon }}</v-icon>
        </v-list-item-action>
        <v-list-item-title class="text-capitalize">
          {{ darkModeOn ? 'Dark Mode' : 'Light Mode' }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-action>
          <v-icon>mdi-exit-to-app</v-icon>
        </v-list-item-action>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'AppDrawer',
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      togglingMode: false
    }),
    computed: {
      ...mapState([
        'version'
      ]),
      ...mapState('app', [
        'drawer'
      ]),
      ...mapGetters([
        'currentUser'
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
      },
      darkModeOn () {
        return this.currentUser.dark_mode
      },
      modeIcon () {
        return `mdi-weather-${this.darkModeOn ? 'night' : 'sunny'}`
      }
    },
    mounted () {
      this.setDrawer(window.innerWidth >= 991)
    },
    methods: {
      ...mapMutations('app', [
        'setDrawer'
      ]),
      ...mapActions({
        logout: 'logout',
        setDarkMode: 'user/setDarkMode'
      }),
      async toggleMode () {
        try {
          this.togglingMode = true
          await this.setDarkMode(!this.darkModeOn)
        } catch (e) {
          console.error(e)
        } finally {
          this.togglingMode = false
        }
      }
    }
  }
</script>
