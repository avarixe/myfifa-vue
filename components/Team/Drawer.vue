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
            :to="{ name: 'teams-teamId', params: { teamId }}"
            active-class=""
            exact
          >
            <v-list-item-avatar>
              <v-icon>mdi-shield-half-full</v-icon>
            </v-list-item-avatar>
            <v-list-item-title
              class="title"
              color="primary"
            >{{ teamName }}</v-list-item-title>
          </v-list-item>

          <v-divider/>

          <team-date-picker>
            <template #default="{ on, date }">
              <v-list-item
                v-ripple
                v-on="on"
                color="accent"
                class="v-list-item"
                style="width: 100%"
              >
                <v-list-item-action>
                  <v-icon>mdi-calendar</v-icon>
                </v-list-item-action>
                <v-list-item-title>
                  {{ $_format(date, 'MMM DD, YYYY') }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </team-date-picker>

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
  import { mixins, Component } from 'nuxt-property-decorator'
  import { mapState, mapMutations } from 'vuex'
  import { TeamAccessible } from '@/mixins'
  import TeamDatePicker from '@/components/Team/DatePicker'

  @Component({
    components: {
      TeamDatePicker
    },
    computed: mapState('app', [
      'drawer'
    ]),
    methods: mapMutations('app', {
      setDrawer: 'SET_DRAWER'
    })
  })
  export default class TeamDrawer extends mixins(TeamAccessible) {
    get teamId () {
      return this.$route.params.teamId
    }

    get teamName () {
      return this.team.title
    }

    get teamLinks () {
      if (this.teamId) {
        return [
          {
            to: this.linkTo('seasons'),
            icon: 'mdi-trophy',
            text: 'Seasons'
          },
          {
            to: this.linkTo('players'),
            icon: 'mdi-account',
            text: 'Players'
          },
          {
            to: this.linkTo('matches'),
            icon: 'mdi-soccer-field',
            text: 'Matches'
          },
          {
            to: this.linkTo('squads'),
            icon: 'mdi-clipboard-text',
            text: 'Squads'
          },
          {
            to: this.linkTo('transfers'),
            icon: 'mdi-airplane-takeoff',
            text: 'Transfers'
          }
        ]
      } else {
        return []
      }
    }

    mounted () {
      this.setDrawer(window.innerWidth >= 991)
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
