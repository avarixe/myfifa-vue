<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="drawer"
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
          <v-list-tile-title class="title">
            MyFIFA Manager
          </v-list-tile-title>
        </v-list-tile>
        <v-divider/>

        <template v-if="teamId">
          <team-calendar />

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
            <v-list-tile-title
              v-text="link.text"
            />
          </v-list-tile>
        </template>
        <template v-else>

        </template>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
  import {
    mapMutations
  } from 'vuex'
  import TeamCalendar from '@/components/Team/TeamCalendar'

  export default {
    components: {
      TeamCalendar
    },
    data: () => ({
      links: [
        {
          to: '/dashboard',
          icon: 'mdi-view-dashboard',
          text: 'Dashboard'
        },
        {
          to: '/user-profile',
          icon: 'mdi-account',
          text: 'User Profile'
        },
        {
          to: '/table-list',
          icon: 'mdi-clipboard-outline',
          text: 'Table List'
        },
        {
          to: '/typography',
          icon: 'mdi-format-font',
          text: 'Typography'
        },
        {
          to: '/icons',
          icon: 'mdi-chart-bubble',
          text: 'Icons'
        },
        {
          to: '/maps',
          icon: 'mdi-map-marker',
          text: 'Maps'
        },
        {
          to: '/notifications',
          icon: 'mdi-bell',
          text: 'Notifications'
        }
      ]
    }),
    computed: {
      teamId () {
        return this.$route.params.teamId
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
            }
          ]
        } else {
          return []
        }
      }
    },
    watch: {
      drawer: {
        get () {
          return this.$store.state.app.drawer
        },
        set (val) {
          this.setDrawer(val)
        }
      }
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
