<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <material-card :title="player.name">
          <v-layout
            class="text-xs-center"
            row
            wrap
          >
            <v-flex
              xs6
              sm3
            >
              <div class="display-1">{{ player.pos }}</div>
              <div class="subheading">Position</div>
            </v-flex>
            <v-flex
              xs6
              sm3
            >
              <div class="display-1">{{ $_listArray(player.sec_pos) }}</div>
              <div class="subheading">Secondary Position(s)</div>
            </v-flex>
            <v-flex
              xs6
              sm3
            >
              <div class="display-1">{{ player.age }}</div>
              <div class="subheading">Age</div>
            </v-flex>
            <v-flex
              xs6
              sm3
            >
              <div class="display-1">{{ player.status || '-' }}</div>
              <div class="subheading">Status</div>
            </v-flex>
            <v-flex xs12>
              <player-form
                :player-data="player"
                color="orange"
              >
                <template #default="{ on: dialog }">
                  <v-tooltip
                    bottom
                    color="orange"
                  >
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        v-on="{ ...dialog, ...tooltip }"
                        icon
                      >
                        <v-icon color="orange">mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    Edit
                  </v-tooltip>
                </template>
              </player-form>
              <transfer-form :player="player" />
              <contract-form :player="player" />
              <injury-form
                v-if="active"
                :player="player"
              />
              <loan-form
                v-if="active"
                :player="player"
              />
              <player-retire
                v-if="active"
                :player="player"
              />
              <player-release
                v-if="active"
                :player="player"
              />
              <player-remove :player="player" />
            </v-flex>
          </v-layout>

        </material-card>
      </v-flex>

      <v-flex
        xs12
        sm6
      >
        <material-chart-card
          :data="ovrChart.data"
          :options="ovrChart.options"
          ratio="ct-major-twelfth"
          color="green"
          type="Line"
        >
          <h4 class="title font-weight-light">
            <span class="green--text">{{ player.ovr }}</span>
            <small>OVR</small>
          </h4>
          <p class="category d-inline-flex font-weight-light" />
        </material-chart-card>
      </v-flex>

      <v-flex
        xs12
        sm6
      >
        <material-chart-card
          :data="valueChart.data"
          :options="valueChart.options"
          ratio="ct-major-twelfth"
          color="info"
          type="Line"
        >
          <h4 class="title font-weight-light">
            <span class="green--text">{{ $_formatMoney(player.value) }}</span>
            <small>Value</small>
          </h4>
          <p class="category d-inline-flex font-weight-light" />
        </material-chart-card>
      </v-flex>

      <v-flex
        xs12
        sm3
      >
        <material-stats-card
          color="teal"
          icon="mdi-soccer-field"
          title="Matches"
          :value="statistics.numGames"
        />
      </v-flex>

      <v-flex
        xs12
        sm3
      >
        <material-stats-card
          color="blue"
          icon="mdi-soccer"
          title="Goals"
          :value="statistics.numGoals"
        />
      </v-flex>

      <v-flex
        xs12
        sm3
      >
        <material-stats-card
          color="orange"
          icon="mdi-soccer"
          title="Assists"
          :value="statistics.numAssists"
        />
      </v-flex>

      <v-flex
        xs12
        sm3
      >
        <material-stats-card
          color="pink"
          icon="mdi-wall"
          title="Clean Sheets"
          :value="statistics.numCs"
        />
      </v-flex>

      <v-flex xs12>
        <material-card color="accent">
          <template #header>
            <span class="title font-weight-light mb-2">Timeline</span>

            <!-- Timeline Filter -->
            <v-tooltip top>
              <template #activator="{ on: tooltip }">
                <v-menu
                  bottom
                  right
                >
                  <template #activator="{ on: menu }">
                    <v-btn
                      v-on="{ ...menu, ...tooltip }"
                      icon
                    >
                      <v-icon :color="currentFilter.color">mdi-{{ currentFilter.icon }}</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-tile
                      v-for="(event, key) in filterOptions"
                      :key="key"
                      @click="timelineFilter = key"
                    >
                      <v-list-tile-avatar>
                        <v-icon :color="event.color">mdi-{{ event.icon }}</v-icon>
                      </v-list-tile-avatar>
                      <v-list-tile-title>{{ key }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </template>
              Filter Timeline
            </v-tooltip>
          </template>

          <player-timeline
            :contracts="contracts"
            :filter="timelineFilter"
            :injuries="injuries"
            :loans="loans"
            :transfers="transfers"
          />
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'
  import { parse } from 'date-fns'
  import { Player } from '@/models'
  import PlayerForm from '@/components/Player/PlayerForm'
  import ContractForm from '@/components/Player/ContractForm'
  import InjuryForm from '@/components/Player/InjuryForm'
  import LoanForm from '@/components/Player/LoanForm'
  import TransferForm from '@/components/Player/TransferForm'
  import PlayerRetire from '@/components/Player/PlayerRetire'
  import PlayerRelease from '@/components/Player/PlayerRelease'
  import PlayerRemove from '@/components/Player/PlayerRemove'
  import PlayerTimeline from '@/components/Player/Timeline'
  import MaterialCard from '@/components/theme/Card'
  import MaterialChartCard from '@/components/theme/ChartCard'
  import MaterialStatsCard from '@/components/theme/StatsCard'
  import { TeamAccessible } from '@/mixins'

  export default {
    layout: 'team',
    components: {
      PlayerForm,
      ContractForm,
      InjuryForm,
      LoanForm,
      TransferForm,
      PlayerRetire,
      PlayerRelease,
      PlayerRemove,
      PlayerTimeline,
      MaterialCard,
      MaterialChartCard,
      MaterialStatsCard
    },
    middleware: 'authenticated',
    mixins: [
      TeamAccessible
    ],
    data () {
      return {
        historyHeaders: [
          { text: 'Datestamp', value: 'datestamp', align: 'center' },
          { text: 'OVR',   value: 'ovr',  align: 'center' },
          { text: 'Value', value: 'value',    align: 'center' }
        ],
        filterOptions: {
          'All': { icon: 'filter-variant' },
          'Contract': { icon: 'file-document', color: 'blue' },
          'Injury': { icon: 'hospital', color: 'pink' },
          'Loan': { icon: 'transit-transfer', color: 'indigo' },
          'Transfer': { icon: 'airplane-takeoff', color: 'green' }
        },
        timelineFilter: 'All',
        statistics: {}
      }
    },
    head () {
      return {
        title: this.player.name
      }
    },
    computed: {
      player () {
        return Player
          .query()
          .with('contracts')
          .with('loans')
          .with('injuries')
          .with('transfers')
          .with('histories')
          .find(this.$route.params.playerId)
      },
      active () { return this.player.status && this.player.status.length > 0 },

      contracts () { return this.player.contracts },
      loans () { return this.player.loans },
      injuries () { return this.player.injuries },
      transfers () { return this.player.transfers },
      histories () { return this.player.histories },

      ovrChart () {
        return {
          data: {
            labels: this.histories.map(h => parse(h.datestamp)),
            series: [
              this.histories.map(h => h.ovr)
            ]
          },
          options: {
            axisX: {
              showGrid: false,
              showLabel: false
            },
            low: 40,
            high: 100,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          }
        }
      },

      valueChart () {
        return {
          data: {
            labels: this.histories.map(h => parse(h.datestamp)),
            series: [
              this.histories.map(h => h.value)
            ]
          },
          options: {
            axisX: {
              showGrid: false,
              showLabel: false
            },
            low: 0,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          }
        }
      },

      currentFilter () {
        return this.filterOptions[this.timelineFilter]
      }
    },
    async fetch ({ store, params }) {
      await store.dispatch('players/GET', params)
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
      this.getStatistics()
      this.getHistory({ playerId: this.player.id })
    },
    watch: {
      player (val) {
        !val && this.$router.push({
          name: 'teams-teamId-players',
          params: { teamId: this.team.id }
        })
      }
    },
    methods: {
      ...mapActions('players', {
        getPlayer: 'GET',
        analyze: 'ANALYZE',
        getHistory: 'GET_HISTORY'
      }),
      async getStatistics () {
        const { data } = await this.analyze({
          teamId: this.team.id,
          playerIds: [this.player.id]
        })
        this.statistics = {
          numGames: data.num_games[this.player.id] || 0,
          numGoals: data.num_goals[this.player.id] || 0,
          numAssists: data.num_assists[this.player.id] || 0,
          numCs: data.num_cs[this.player.id] || 0
        }
      }
    }
  }
</script>

<style scoped>
  .g-chart {
    line-height: 0 !important;
  }
</style>
