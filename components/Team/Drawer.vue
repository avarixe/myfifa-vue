<template>
  <v-navigation-drawer
    id="app-drawer"
    :value="drawer"
    app
    clipped
    mobile-break-point="991"
    width="260px"
    @input="setDrawer"
  >
    <v-img
      src=""
      height="100%"
    >
      <v-list nav>
        <template v-if="teamId">
          <team-date-picker menu-class="d-block">
            <template #default="{ on, date }">
              <v-list-item
                v-ripple
                color="accent"
                style="width: 100%"
                v-on="on"
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
            :exact="link.exact"
            active-class=""
            class="v-list-item"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
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
            to: {
              name: 'teams-teamId',
              params: { teamId: this.teamId }
            },
            icon: 'mdi-view-dashboard',
            text: 'Dashboard',
            exact: true
          },
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
