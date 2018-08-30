<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div class="display-2">{{ player.name }}</div>
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
              <v-flex xs12>
                <player-form :initial-player="player" color="orange">
                  <v-btn color="orange" dark>Edit</v-btn>
                </player-form>
                <transfer-form :player="player">
                  <v-btn :color="active ? 'red' : 'green'" dark>Transfer</v-btn>
                </transfer-form>
                <contract-form :player="player">
                  <v-btn color="blue" dark>Contract</v-btn>
                </contract-form>
                <injury-form v-if="active" :player="player">
                  <v-btn color="pink" dark>Injury</v-btn>
                </injury-form>
                <loan-form v-if="active" :player="player">
                  <v-btn color="indigo" dark>Loan</v-btn>
                </loan-form>
                <player-remove :player="player">
                  <v-btn dark>Remove</v-btn>
                </player-remove>
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
                <div class="teal--text display-1">{{ player.num_games }}</div>
                <div class="subheading">Matches</div>
              </v-flex>
              <v-flex xs12 sm3>
                <div class="blue--text display-1">{{ player.num_goals }}</div>
                <div class="subheading">Goals</div>
              </v-flex>
              <v-flex xs12 sm3>
                <div class="orange--text display-1">{{ player.num_assists }}</div>
                <div class="subheading">Assists</div>
              </v-flex>
              <v-flex xs12 sm3>
                <div class="pink--text display-1">{{ player.num_cs }}</div>
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
              <v-flex sm6>
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
              <v-flex sm6>
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
                    {{ currentFilter.icon }}
                  </v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile
                    v-for="(event, key) in filterOptions"
                    :key="key"
                    @click="timelineFilter = key">
                    <v-list-tile-avatar>
                      <v-icon :color="event.color">{{ event.icon }}</v-icon>
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
  import { mapState, mapActions } from 'vuex'
  import PlayerForm from '@/components/Player/PlayerForm'
  import ContractForm from '@/components/Player/ContractForm'
  import InjuryForm from '@/components/Player/InjuryForm'
  import LoanForm from '@/components/Player/LoanForm'
  import TransferForm from '@/components/Player/TransferForm'
  import PlayerRemove from '@/components/Player/PlayerRemove'
  import PlayerTimeline from '@/components/Player/Timeline'
  import TeamAction from '@/mixins/TeamAction'

  export default {
    layout: 'team',
    components: {
      PlayerForm,
      ContractForm,
      InjuryForm,
      LoanForm,
      TransferForm,
      PlayerRemove,
      PlayerTimeline
    },
    middleware: 'authenticated',
    mixins: [ TeamAction ],
    data () {
      return {
        historyHeaders: [
          { text: 'Datestamp', value: 'datestamp', align: 'center' },
          { text: 'OVR',   value: 'ovr',  align: 'center' },
          { text: 'Value', value: 'value',    align: 'center' }
        ],
        filterOptions: {
          'All': { icon: 'filter_list' },
          'Contract': { icon: 'description', color: 'blue' },
          'Injury': { icon: 'local_hospital', color: 'pink' },
          'Loan': { icon: 'transfer_within_a_station', color: 'indigo' },
          'Transfer': { icon: 'flight_takeoff', color: 'green' }
        },
        timelineFilter: 'All',
        contracts: [],
        loans: [],
        injuries: [],
        transfers: []
      }
    },
    computed: {
      ...mapState('player', {
        players: 'list'
      }),
      player () {
        return this.players[this.$route.params.playerId]
      },
      active () {
        return this.player.status && this.player.status.length > 0
      },
      histories () {
        return this.player.player_histories
      },
      ovrGrowth () {
        return this.histories.map(h => [ h.datestamp, h.ovr ])
      },
      valueGrowth () {
        return this.histories.map(h => [ h.datestamp, h.value ])
      },
      currentFilter () {
        return this.filterOptions[this.timelineFilter]
      }
    },
    async fetch ({ store, params }) {
      await store.dispatch('team/get', { teamId: params.teamId, activate: true })
      await store.dispatch('player/get', { playerId: params.playerId })
    },
    mounted () {
      this.analyzeStatistics({
        teamId: this.team.id,
        playerIds: [ this.player.id ]
      })
      this.setContracts()
      this.setLoans()
      this.setInjuries()
      this.setTransfers()
    },
    watch: {
      player (val) {
        !val && this.$router.push('/teams/' + this.$route.params.teamId)
      }
    },
    methods: {
      ...mapActions({
        analyzeStatistics: 'player/analyze',
        getContracts: 'contract/getAll',
        getLoans: 'loan/getAll',
        getInjuries: 'injury/getAll',
        getTransfers: 'transfer/getAll'
      }),
      async setContracts () {
        const { data } = await this.getContracts({
          playerId: this.$route.params.playerId
        })
        this.contracts = data
      },
      async setLoans () {
        const { data } = await this.getLoans({
          playerId: this.$route.params.playerId
        })
        this.loans = data
      },
      async setInjuries () {
        const { data } = await this.getInjuries({
          playerId: this.$route.params.playerId
        })
        this.injuries = data
      },
      async setTransfers () {
        const { data } = await this.getTransfers({
          playerId: this.$route.params.playerId
        })
        this.transfers = data
      }
    }
  }
</script>

<style scoped>
  .g-chart {
    line-height: 0 !important;
  }
</style>
