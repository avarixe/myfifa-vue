<template>
  <v-app>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-title>
          <v-icon>fa-futbol</v-icon>
          MyFIFA Manager
      </v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only">
        <v-breadcrumbs large divider="/">
          <v-breadcrumbs-item v-if="activeTeam && activeTeam.title">
            // {{ activeTeam.title }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-speed-dial
        v-model="fab"
        v-if="authenticated"
        fixed
        bottom
        right>
        <v-btn
          slot="activator"
          v-model="fab"
          color="blue darken-2"
          dark
          fab>
          <v-icon>menu</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-tooltip left color="red darken-2">
          <v-btn
            slot="activator"
            dark
            color="red darken-2"
            fab
            @click.native="logout">
            <v-icon>exit_to_app</v-icon>
          </v-btn>
          <span>Log Out</span>
        </v-tooltip>
        <v-tooltip left color="indigo">
          <v-btn
            slot="activator"
            v-show="this.$route.path !== '/'"
            dark
            color="indigo"
            fab
            to="/">
            <v-icon>swap_horiz</v-icon>
          </v-btn>
          <span>Change Team</span>
        </v-tooltip>
      </v-speed-dial>

      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      fab: false
    }),
    computed: {
      ...mapState('user', [
        'expirationDate'
      ]),
      ...mapState('team', {
        activeTeam: 'active'
      }),
      ...mapGetters('user', [
        'authenticated'
      ])
    },
    watch: {
      '$route' () {
        this.redirectToAuthentication()
      },
      authenticated () {
        this.redirectToAuthentication()
      }
    },
    methods: {
      ...mapActions('user', [
        'logout',
        'clear'
      ]),
      checkIfTokenExpired () {
        if (this.authenticated && Date.now() > this.expirationDate) {
          this.clear()
        }
      },
      redirectToAuthentication () {
        switch (this.$route.path) {
          case '/login':
            if (this.authenticated) {
              this.$router.push('/')
            }
            break
          default:
            if (!this.authenticated) {
              this.$router.push('/login')
            }
        }
      }
    },
    mounted () {
      this.redirectToAuthentication()
    },
    name: 'App'
  }
</script>
