<template>
  <v-navigation-drawer
    :value="drawer"
    @input="setDrawer"
    id="app-drawer"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <v-img
      src=""
      height="100%"
    >
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <!--<v-img
              src=""
              height="34"
              contain
            />-->
            <v-icon color="primary">mdi-soccer</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title class="title">MyFIFA Manager</v-list-tile-title>
        </v-list-tile>

        <v-divider/>

        <template v-if="teamId">
          <v-list-tile
            :to="{ name: 'teams-teamId', params: { teamId } }"
            active-class=""
            avatar
            exact
          >
            <v-list-tile-avatar>
              <v-icon>mdi-home</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>{{ teamName }}</v-list-tile-title>
          </v-list-tile>

          <team-date-picker />

          <v-list-tile
            v-for="(link, i) in teamLinks"
            :key="i"
            :to="link.to"
            active-class=""
            avatar
            class="v-list-item"
          >
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{ link.text }}</v-list-tile-title>
          </v-list-tile>
        </template>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
  import { Team } from '@/models'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import TeamDatePicker from '@/components/Team/TeamDatePicker'

  export default {
    components: {
      TeamDatePicker
    },
    computed: {
      ...mapState('app', [
        'drawer'
      ]),
      teamId () {
        return this.$route.params.teamId
      },
      team () {
        return Team.find(this.teamId)
      },
      teamName () {
        return this.team.title
      },
      teamLinks () {
        if (this.teamId) {
          return [
            {
              to: {
                name: 'teams-teamId-seasons',
                params: { teamId: this.teamId }
              },
              icon: 'mdi-trophy',
              text: 'Seasons'
            },
            {
              to: {
                name: 'teams-teamId-players',
                params: { teamId: this.teamId }
              },
              icon: 'mdi-account',
              text: 'Players'
            },
            {
              to: {
                name: 'teams-teamId-matches',
                params: { teamId: this.teamId }
              },
              icon: 'mdi-soccer-field',
              text: 'Matches'
            },
            {
              to: {
                name: 'teams-teamId-squads',
                params: { teamId: this.teamId }
              },
              icon: 'mdi-clipboard-text',
              text: 'Squads'
            },
            {
              to: {
                name: 'teams-teamId-transfers',
                params: { teamId: this.teamId }
              },
              icon: 'mdi-airplane-takeoff',
              text: 'Transfers'
            }
          ]
        } else {
          return []
        }
      }
    },
    mounted () {
      this.setDrawer(window.innerWidth >= 991)
    },
    methods: {
      ...mapMutations('app', {
        setDrawer: 'SET_DRAWER'
      })
    }
  }
</script>

<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }

    .v-image__image--contain {
      top: 9px;
      height: 60%;
    }

    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
</style>
