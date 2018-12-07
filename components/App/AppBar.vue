<template>
  <v-toolbar fixed dense app color="primary" dark>
    <v-menu
      v-if="authenticated"
      v-model="menu"
      offset-y
      class="hidden-sm-and-up">
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

        <user-form>
          <v-list-tile>
            <v-list-tile-avatar>
              <v-icon>mdi-account</v-icon>
            </v-list-tile-avatar>
            Account
          </v-list-tile>
        </user-form>

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

    <v-spacer></v-spacer>

    <template v-if="authenticated">
      <v-tooltip color="blue" class="hidden-xs-only" bottom>
        <v-btn
          slot="activator"
          nuxt
          to="/"
          active-class=""
          icon>
          <v-icon>mdi-home</v-icon>
        </v-btn>
        Home
      </v-tooltip>

      <user-form>
        <v-tooltip color="blue" class="hidden-xs-only" bottom>
          <v-btn slot="activator" icon>
            <v-icon>mdi-account</v-icon>
          </v-btn>
          Account
        </v-tooltip>
      </user-form>

      <v-tooltip color="blue" class="hidden-xs-only" bottom>
        <v-btn
          slot="activator"
          @click="logout"
          icon>
          <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>
        Log Out
      </v-tooltip>
    </template>

  </v-toolbar>
</template>

<script>
  import UserForm from './UserForm'
  import { mapState, mapGetters } from 'vuex'
  import Cookie from 'js-cookie'

  export default {
    components: {
      UserForm
    },
    data: () => ({
      menu: false
    }),
    computed: {
      ...mapState('entities/teams', { teamId: 'currentId' }),
      ...mapGetters({
        authenticated: 'authenticated',
        team: 'entities/teams/current'
      }),
      items () {
        let items = []
        this.team && items.push({ text: this.team.title })
        return items
      },
      teamLink () {
        return {
          name: 'teams-id',
          params: { id: this.team.id }
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
