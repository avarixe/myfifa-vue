<template>
  <v-app>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-title>
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
      <navigation-dial></navigation-dial>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import NavigationDial from '@/components/NavigationDial'

  export default {
    data: () => ({
      fab: false
    }),
    computed: {
      // ...mapState('user', [
      //   'expirationDate'
      // ]),
      ...mapState('team', {
        activeTeam: 'active'
      }),
      ...mapGetters('user', [
        'authenticated'
      ])
    },
    watch: {
      authenticated (val) {
        !val && this.$router.push('/')
      }
    },
    methods: {
      ...mapActions('user', [
        'clear'
      ])
      // checkIfTokenExpired () {
      //   if (this.authenticated && Date.now() > this.expirationDate) {
      //     this.clear()
      //   }
      // }
    },
    // mounted () {
    //   this.checkIfTokenExpired()
    // },
    components: {
      'navigation-dial': NavigationDial
    },
    name: 'App'
  }
</script>

<style>
  .v-dialog--active .v-card > .v-card__text {
    max-height: 60vh;
    overflow-y: auto;
  }
</style>