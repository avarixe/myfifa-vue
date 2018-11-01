<template>
  <v-toolbar fixed dense app color="primary" dark>
    <v-menu
      v-if="authenticated"
      v-model="menu"
      offset-y>
      <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
      <v-list class="primary" dark>
        <v-list-tile
          active-class=""
          to="/"
          nuxt>
          <v-list-tile-avatar>
            <v-icon>mdi-home</v-icon>
          </v-list-tile-avatar>
          Home
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-avatar>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-tile-avatar>
          Log Out
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-toolbar-title>MyFIFA Manager</v-toolbar-title>
    <v-toolbar-items class="hidden-xs-only">
      <v-breadcrumbs
        :items="items"
        class="white--text"
        large
      ></v-breadcrumbs>
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
      ...mapState('team', { teamId: 'currentId' }),
      ...mapGetters({
        authenticated: 'authenticated',
        team: 'team/current'
      }),
      items () {
        let items = []
        this.team && items.push({ text: this.team.title })
        this.player && items.push({ text: this.player.name })
        return items
      },
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
      },
      teamId (val) {
        this.$store.commit('match/RESET')
        this.$store.commit('player/RESET')
        this.$store.commit('squad/RESET')
        this.$store.commit('competition/RESET')
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
