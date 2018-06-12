<template>
  <v-app>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-title>
        <v-icon>fa-futbol</v-icon>
        MyFIFA Manager
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-speed-dial
        v-model="fab"
        v-if="isAuthenticated"
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
        <v-tooltip left>
          <v-btn
            slot="activator"
            dark
            color="red"
            fab
            @click.native="logout">
            <v-icon>exit_to_app</v-icon>
          </v-btn>
          <span>Log Out</span>
        </v-tooltip>
        <v-tooltip left>
          <v-btn
            slot="activator"
            dark
            color="indigo"
            fab
            to="/teams">
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
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      fab: false
    }),
    computed: mapGetters({
      isAuthenticated: 'user/authenticated',
      activeTeam: 'team/activeId',
      expirationDate: 'user/expirationDate'
    }),
    watch: {
      '$route' () {
        this.redirectToAuthentication()
      }
    },
    methods: {
      ...mapActions({
        logout: 'user/logout',
        clear: 'user/clear'
      }),
      checkIfTokenExpired () {
        if (this.isAuthenticated && Date.now() > this.expirationDate) {
          this.clear()
        }
      },
      redirectToAuthentication () {
        switch (this.$route.path) {
          case '/login':
            if (this.isAuthenticated) {
              this.$router.push('/')
            }
            break
          default:
            if (!this.isAuthenticated) {
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
