<template>
  <v-app>
    <app-bar></app-bar>
    <v-content>
      <app-broadcaster></app-broadcaster>
      <div class="pt-5">
        <team-toolbar :team="team"></team-toolbar>
        <nuxt />
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import AppBar from '@/components/AppBar'
  import TeamToolbar from '@/components/Team/TeamToolbar'
  import AppBroadcaster from '@/components/AppBroadcaster'

  export default {
    name: 'App',
    components: {
      AppBar,
      TeamToolbar,
      AppBroadcaster
    },
    computed: {
      ...mapState('team', { teams: 'list' }),
      team () {
        return this.$route.params.teamId &&
          this.teams[this.$route.params.teamId]
      }
    }
  }
</script>

<style>
  #app .v-dialog--active .v-card > .v-card__text {
    max-height: 60vh;
    overflow-y: auto;
  }

  #app .v-toolbar__title > span {
    cursor: pointer;
  }

  #app .v-content {
    background: url(https://joondev.com/images/stadium.jpeg) no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  #app .v-card,
  #app .v-expansion-panel__container--active > .v-expansion-panel__header {
    background-color: rgba(255, 255, 255, 0.9);
  }

  #app .v-dialog .v-card,
  #app .v-menu__content > .v-list {
    background-color: #fafafa;
  }

  #app .v-datatable,
  #app .v-datatable tbody tr:hover:not(.v-datatable__expand-row) {
    background-color: rgba(255, 255, 255, 0.5);
  }

  #app .v-datatable__actions,
  #app .v-datatable .v-list,
  #app .v-expansion-panel__container {
    background-color: transparent;
  }
</style>
