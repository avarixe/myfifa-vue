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
        <v-list-tile
          avatar
        >
          <v-list-tile-avatar>
            <!--<v-img
              src=""
              height="34"
              contain
            />-->
            <v-icon
              color="primary"
              v-text="'mdi-soccer'"
            />
          </v-list-tile-avatar>
          <v-list-tile-title
            class="title"
            v-text="'MyFIFA Manager'"
          />
        </v-list-tile>
        <v-divider/>

        <template
          v-if="teamId"
        >
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
              <v-icon
                v-text="link.icon"
              />
            </v-list-tile-action>
            <v-list-tile-title
              v-text="link.text"
            />
          </v-list-tile>
        </template>
        <template
          v-else
        ></template>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import TeamCalendar from '@/components/Team/TeamCalendar'

  export default {
    components: {
      TeamCalendar
    },
    computed: {
      ...mapState('app', [
        'drawer'
      ]),
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
