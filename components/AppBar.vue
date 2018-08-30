<template>
  <v-toolbar fixed dense app>
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
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import Cookie from 'js-cookie'

  export default {
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
