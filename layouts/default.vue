<template>
  <v-app>
    <v-toolbar fixed app>
      <v-menu
        v-if="authenticated"
        v-model="menu"
        offset-y>
        <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
        <v-list>
          <v-list-tile nuxt to="/teams">
            <v-list-tile-avatar>
              <v-icon>people</v-icon>
            </v-list-tile-avatar>
            Teams
          </v-list-tile>
          <v-list-tile @click="logout">
            <v-list-tile-avatar>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-avatar>
            Log Out
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-toolbar-title>
        <nuxt-link to="/" tag="span">
          MyFIFA Manager
        </nuxt-link>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only">
        <v-breadcrumbs
          v-if="!!team"
          large>
          <v-breadcrumbs-item
            nuxt
            :to="teamLink"
            exact>
            {{ team.title }}
          </v-breadcrumbs-item>
          <v-breadcrumbs-item
            v-if="!!player"
            nuxt
            :to="playerLink"
            exact>
            {{ player.name }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-toolbar-items>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <app-broadcaster></app-broadcaster>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  // import AppNavigationDial from '@/components/AppNavigationDial'
  import AppBroadcaster from '@/components/AppBroadcaster'
  import Cookie from 'js-cookie'

  export default {
    name: 'App',
    components: {
      // 'app-navigation-dial': AppNavigationDial,
      'app-broadcaster': AppBroadcaster
    },
    data: () => ({
      menu: false
    }),
    computed: {
      ...mapState('team', { teams: 'list' }),
      ...mapState('player', { players: 'list' }),
      ...mapGetters([ 'authenticated' ]),
      team () {
        return this.$route.params.teamId &&
          this.teams[this.$route.params.teamId]
      },
      player () {
        return this.$route.params.playerId &&
          this.players[this.$route.params.playerId]
      },
      teamLink () {
        return '/teams/' + this.team.id
      },
      playerLink () {
        return this.teamLink + '/players/' + this.player.id
      }
    },
    watch: {
      authenticated (val) {
        !val && this.$router.push('/')
      }
    },
    methods: {
      async logout () {
        await this.$store.dispatch('logout')
        Cookie.remove('token')
      }
    }
  }
</script>

<style>
  .v-dialog--active .v-card > .v-card__text {
    max-height: 60vh;
    overflow-y: auto;
  }

  #app .v-card {
    background-color: rgba(255, 255, 255, 0.75);
  }

  #app .v-dialog .v-card,
  #app .v-menu__content > .v-list {
    background-color: #fafafa;
  }

  #app .v-datatable {
    background-color: rgba(255, 255, 255, 0.5);
  }

  #app .v-datatable__actions,
  #app .v-list {
    background-color: transparent;
  }
</style>

<style scoped>
  .v-toolbar__title > span {
    cursor: pointer;
  }

  /**/
  .v-content {
    background: url(https://joondev.com/images/stadium.jpeg) no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
  /**/
</style>
