<template>
  <v-app>
    <v-navigation-drawer fixed v-if="loggedIn" v-model="drawer" app>
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          router
          :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark fixed app>
      <v-toolbar-side-icon
        v-if="loggedIn"
        @click.stop="drawer = !drawer"
      ></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span">MyFIFA Manager</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-if="loggedIn"
          @click.native="logOut"
        >
          Log Out
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <myfifa-login-drawer></myfifa-login-drawer>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import LoginDrawer from '@/components/LoginDrawer.vue'

  export default {
    data () {
      return {
        drawer: false,
        menuItems: [
          { icon: 'mdi-soccer', title: 'Teams', link: '/teams' },
          { icon: 'mdi-account', title: 'Players', link: '/players' }
        ]
      }
    },
    computed: {
      loggedIn () {
        return !!this.$store.state.user.token
      }
    },
    methods: {
      logOut () {
        this.$store.dispatch('user/logUserOut')
      }
    },
    components: {
      'myfifa-login-drawer': LoginDrawer
    },
    name: 'App'
  }
</script>

<style scoped>
  .toolbar__title > span {
    cursor: pointer;
  }
</style>