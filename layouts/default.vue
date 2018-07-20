<template>
  <v-app>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-title>
        <router-link to="/" tag="span">
          MyFIFA Manager
        </router-link>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only">
        <v-breadcrumbs large divider="/">
          <v-breadcrumbs-item v-if="team && team.title">
            // {{ team.title }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <navigation-dial v-if="authenticated"></navigation-dial>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import TheNavigationDial from '@/components/TheNavigationDial'

  export default {
    name: 'App',
    components: {
      'navigation-dial': TheNavigationDial
    },
    mixins: [ TeamAction ],
    computed: mapGetters([ 'authenticated' ]),
    watch: {
      authenticated (val) {
        !val && this.$router.push('/')
      }
    }
  }
</script>

<style>
  .v-dialog--active .v-card > .v-card__text {
    max-height: 60vh;
    overflow-y: auto;
  }
</style>

<style scoped>
  .v-toolbar__title > span {
    cursor: pointer;
  }
</style>
