<template>
  <v-navigation-drawer
    :value="drawer"
    @input="setDrawer"
    id="app-drawer"
    app
    clipped
    mobile-break-point="991"
    width="260px"
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
        <template v-if="teamId">
          <v-list-item
            :to="{ name: 'teams-teamId', params: { teamId } }"
            active-class=""
            exact
          >
            <v-list-item-title
              class="title"
              color="primary"
            >{{ teamName }}</v-list-item-title>
          </v-list-item>

          <v-divider/>

          <team-date-picker />

          <v-list-item
            v-for="(link, i) in teamLinks"
            :key="i"
            :to="link.to"
            active-class=""
            class="v-list-item"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
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
    .v-list__item {
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
