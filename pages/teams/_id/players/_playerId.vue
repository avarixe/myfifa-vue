<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div class="display-2">{{ player.name }}</div>

            <player-form :initial-player="player" color="orange">
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
  import { mapState, mapActions } from 'vuex'
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
        timelineFilter: 'All'
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
      contracts () {
        return Object.values(this.player.contracts || {})
      },
      loans () {
        return Object.values(this.player.loans || {})
      },
      injuries () {
        return Object.values(this.player.injuries || {})
      },
      transfers () {
        return Object.values(this.player.transfers || {})
      },
      histories () {
        return Object.values(this.player.player_histories || {})
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
      await Promise.all([
        (async () => {
          store.state.team.currentId !== params.id &&
          await store.dispatch('team/get', { teamId: params.id, activate: true })
        })(),
        (async () => {
          !(params.playerId in store.state.player.list) &&
          await store.dispatch('player/get', { playerId: params.playerId })
        })()
      ])
    },
    mounted () {
      this.getStatistics({ teamId: this.team.id, playerIds: [this.player.id] })
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
        getPlayer: 'player/get',
        getStatistics: 'player/getStatistics',
        getHistory: 'player/getHistory',
        getContracts: 'contract/getAll',
        getLoans: 'loan/getAll',
        getInjuries: 'injury/getAll',
        getTransfers: 'transfer/getAll'
      })
    }
  }
</script>

<style scoped>
  .g-chart {
    line-height: 0 !important;
  }
</style>
