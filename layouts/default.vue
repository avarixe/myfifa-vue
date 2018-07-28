<template>
  <v-app>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-title>
        <nuxt-link to="/" tag="span">
          MyFIFA Manager
        </nuxt-link>
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
      <nuxt />
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

  /* 
  .v-content {
    background: url(~/static/stadium.jpeg) no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
  */
</style>
