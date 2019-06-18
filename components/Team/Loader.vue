<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      align-center
      justify-center
    >
      <v-flex xs12 sm6>
        <v-card flat>
          <v-card-title class="font-weight-light">
            <span v-if="!finished">{{ title }}</span>
            <template v-else>
              Team Assets have been loaded!

              <v-spacer />

              <v-icon color="success">mdi-check</v-icon>
            </template>
          </v-card-title>

          <v-divider
            v-if="!finished"
            class="mx-3"
          />

          <v-fade-transition>
            <v-list v-if="!finished">
              <v-slide-y-transition
                v-for="resource in resources"
                :key="resource"
              >
                <v-list-item v-if="!loaders[resource].cleared">
                  <v-list-item-icon>
                    <v-progress-circular
                      v-if="!loaders[resource].loaded"
                      indeterminate
                      color="warning"
                      size="24"
                      width="2"
                    />
                    <v-icon
                      v-else
                      color="success"
                    >mdi-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    {{ resource }}
                  </v-list-item-content>
                </v-list-item>
              </v-slide-y-transition>
            </v-list>
          </v-fade-transition>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'

  @Component({
    methods: mapActions({
      getPlayers: 'players/FETCH',
      getContracts: 'contracts/TEAM_FETCH',
      getTransfers: 'transfers/TEAM_FETCH',
      getLoans: 'loans/TEAM_FETCH',
      getInjuries: 'injuries/TEAM_FETCH',
      getMatches: 'matches/FETCH',
      getSquads: 'squads/FETCH',
      getCompetitions: 'competitions/FETCH',
      getStages: 'stages/TEAM_FETCH',
      getPlayerHistories: 'playerHistories/SEARCH',
      getCaps: 'caps/SEARCH',
      getBookings: 'bookings/SEARCH',
      getGoals: 'goals/SEARCH',
      getSubstitutions: 'substitutions/SEARCH'
    })
  })
  export default class TeamLoader extends Vue {
    @Prop(Object) team

    interval = null
    ellipses = 0
    loaders = {
      'Players': {
        loaded: false,
        cleared: false
      },
      'Player Histories': {
        loaded: false,
        cleared: false
      },
      'Contracts': {
        loaded: false,
        cleared: false
      },
      'Transfers': {
        loaded: false,
        cleared: false
      },
      'Loans': {
        loaded: false,
        cleared: false
      },
      'Injuries': {
        loaded: false,
        cleared: false
      },
      'Matches': {
        loaded: false,
        cleared: false
      },
      'Squads': {
        loaded: false,
        cleared: false
      },
      'Competitions': {
        loaded: false,
        cleared: false
      },
      'Stages': {
        loaded: false,
        cleared: false
      },
      'Bookings': {
        loaded: false,
        cleared: false
      },
      'Goals': {
        loaded: false,
        cleared: false
      },
      'Caps': {
        loaded: false,
        cleared: false
      },
      'Substitutions': {
        loaded: false,
        cleared: false
      }
    }

    get title () {
      return `Loading Team Assets${'.'.repeat(this.ellipses)}`
    }

    get resources () {
      return Object.keys(this.loaders)
    }

    get finished () {
      return this.resources.every(resource => this.loaders[resource].loaded)
    }

    mounted () {
      this.interval = setInterval(() => {
        this.ellipses = (this.ellipses + 1) % 4
      }, 300)

      this.resources.forEach(resource => this.loadData(resource))
    }

    destroyed () {
      clearInterval(this.interval)
    }

    @Watch('finished')
    emitLoaded (val) {
      if (val) {
        setTimeout(() => {
          this.$emit('loaded')
        }, 1000)
      }
    }

    async loadData (resource) {
      await this[`get${resource.replace(/\s+/g, '')}`]({
        teamId: this.team.id
      })

      this.loaders[resource].loaded = true
      setTimeout(() => {
        this.loaders[resource].cleared = true
      }, 1000)
    }
  }
</script>

<style scoped>
  .v-card, .v-list {
    background: transparent
  }
</style>
