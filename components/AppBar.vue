<template>
  <v-toolbar fixed dense app>
    <v-menu
      v-if="authenticated"
      v-model="menu"
      offset-y>
      <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
      <v-list>
        <v-list-tile nuxt to="/">
          <v-list-tile-avatar>
            <v-icon>home</v-icon>
          </v-list-tile-avatar>
          Home
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-avatar>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-avatar>
          Log Out
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-toolbar-title>MyFIFA Manager</v-toolbar-title>
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
      ...mapState('player', { players: 'list' }),
      ...mapGetters({
        authenticated: 'authenticated',
        team: 'team/current'
      }),
      player () {
        return this.$route.name === 'players-id' &&
          this.players[this.$route.params.id]
      },
      teamLink () {
        return {
          name: 'teams-id',
          params: { id: this.team.id }
        }
      },
      playerLink () {
        return {
          name: 'players-id',
          params: { id: this.player.id }
        }
      }
    },
    watch: {
      authenticated (val) {
        !val && this.$router.push({ name: 'index' })
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
