<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div class="display-2">{{ player.name }}</div>

            <player-form :player-data="player" color="orange">
              <v-tooltip bottom color="orange">
                <v-btn slot="activator" icon>
                  <v-icon color="orange">mdi-pencil</v-icon>
                </v-btn>
                Edit
              </v-tooltip>
            </player-form>
            <transfer-form :player="player"></transfer-form>
            <contract-form :player="player"></contract-form>
            <injury-form
              v-if="active"
              :player="player"
            ></injury-form>
            <loan-form
              v-if="active"
              :player="player"
            ></loan-form>
            <player-retire
              v-if="active"
              :player="player"
            ></player-retire>
            <player-release
              v-if="active"
              :player="player"
            ></player-release>
            <player-remove :player="player"></player-remove>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout class="text-xs-center" row wrap>
              <v-flex xs12 sm3>
                <div class="display-1">{{ player.pos }}</div>
                <div class="subheading">Position</div>
              </v-flex>
              <v-flex xs12 sm3>
                <div class="display-1">{{ $_listArray(player.sec_pos) }}</div>
                <div class="subheading">Secondary Position(s)</div>
              </v-flex>
              <v-flex xs12 sm3>
                <div class="display-1">{{ player.age }}</div>
                <div class="subheading">Current Age</div>
              </v-flex>
              <v-flex xs12 sm3>
                <div class="display-1">{{ player.status || '-' }}</div>
                <div class="subheading">Current State</div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div class="headline">Match Statistics</div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout class="text-xs-center" row wrap>
              <v-flex xs12 sm3>
                <div class="teal--text display-1">{{ statistics.numGames }}</div>
                <div class="subheading">Matches</div>
              </v-flex>
              <v-flex xs12 sm3>
                <div class="blue--text display-1">{{ statistics.numGoals }}</div>
                <div class="subheading">Goals</div>
              </v-flex>
              <v-flex xs12 sm3>
                <div class="orange--text display-1">{{ statistics.numAssists }}</div>
                <div class="subheading">Assists</div>
              </v-flex>
              <v-flex xs12 sm3>
                <div class="pink--text display-1">{{ statistics.numCs }}</div>
                <div class="subheading">Clean Sheets</div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-card>
          <v-card-title>
            <div class="headline">Player Growth</div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout class="text-xs-center" row wrap>
              <v-flex xs12 md6>
                <div class="display-1">{{ player.ovr }}</div>
                <div class="subheading">OVR</div>
                <line-chart
                  :data="ovrGrowth"
                  label="OVR"
                  min="40"
                  :library="{ backgroundColor: 'transparent' }"
                  class="g-chart"
                ></line-chart>
              </v-flex>
              <v-flex xs12 md6>
                <div class="display-1">{{ $_formatMoney(player.value) }}</div>
                <div class="subheading">Value</div>
                <line-chart
                  :data="valueGrowth"
                  label="Value"
                  thousands=","
                  :library="{ backgroundColor: 'transparent' }"
                  class="g-chart"
                ></line-chart>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-card>
          <v-card-title>
            <div class="headline">Timeline</div>

            <!-- Timeline Filter -->
            <v-tooltip top>
              <v-menu slot="activator" bottom right>
                <v-btn slot="activator" icon>
                  <v-icon :color="currentFilter.color">
                    mdi-{{ currentFilter.icon }}
                  </v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile
                    v-for="(event, key) in filterOptions"
                    :key="key"
                    @click="timelineFilter = key">
                    <v-list-tile-avatar>
                      <v-icon :color="event.color">mdi-{{ event.icon }}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-title>{{ key }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              Filter Timeline
            </v-tooltip>

          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <player-timeline
              :contracts="contracts"
              :filter="timelineFilter"
              :injuries="injuries"
              :loans="loans"
              :transfers="transfers"
            /></v-card-text>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'
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
  import TeamAccessible from '@/mixins/TeamAccessible'

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
      PlayerTimeline
    },
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
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

      ovrGrowth () { return this.histories.map(h => [ h.datestamp, h.ovr ]) },
      valueGrowth () { return this.histories.map(h => [ h.datestamp, h.value ]) },
      currentFilter () { return this.filterOptions[this.timelineFilter] }
    },
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('entities/teams/GET', { teamId: params.id, activate: true }),
        store.dispatch('entities/players/GET', { playerId: params.playerId })
      ])
    },
    mounted () {
      this.getStatistics()
      this.getHistory({ playerId: this.player.id })
      this.getContracts({ playerId: this.player.id })
      this.getLoans({ playerId: this.player.id })
      this.getInjuries({ playerId: this.player.id })
      this.getTransfers({ playerId: this.player.id })
    },
    watch: {
      player (val) {
        !val && this.$router.push({
          name: 'teams-id-players',
          id: this.team.id
        })
      }
    },
    methods: {
      ...mapActions({
        getPlayer: 'entities/players/GET',
        analyze: 'entities/players/ANALYZE',
        getHistory: 'entities/players/GET_HISTORY',
        getContracts: 'entities/contracts/FETCH',
        getLoans: 'entities/loans/FETCH',
        getInjuries: 'entities/injuries/FETCH',
        getTransfers: 'entities/transfers/FETCH'
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
