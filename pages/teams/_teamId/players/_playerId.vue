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
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <player-timeline
              :contracts="contracts"
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
  import PlayerTimeline from '@/components/Player/Timeline'
  import TeamAction from '@/mixins/TeamAction'

  export default {
    middleware: 'authenticated',
    mixins: [ TeamAction ],
    components: {
      'player-timeline': PlayerTimeline
    },
    data () {
      return {
        historyHeaders: [
          { text: 'Datestamp', value: 'datestamp', align: 'center' },
          { text: 'OVR',   value: 'ovr',  align: 'center' },
          { text: 'Value', value: 'value',    align: 'center' }
        ],
        contractHeaders: [
          { text: 'Effective Date', value: 'effective_date', align: 'center' },
          { text: 'Expiration Date', value: 'end_date', align: 'center' },
          { text: 'Wage', value: 'wage', align: 'center' },
          { text: 'Signing Bonus', value: 'signing_bonus', align: 'center' }
        ],
        injuryHeaders: [
          { text: 'Description', value: 'description', align: 'center' },
          { text: 'Start Date',   value: 'start_date',  align: 'center' },
          { text: 'End Date', value: 'end_date',    align: 'center' }
        ],
        loanHeaders: [
          { text: 'Destination', value: 'datestamp', align: 'center' },
          { text: 'Start Date', value: 'start_date', align: 'center' },
          { text: 'End Date', value: 'end_date', align: 'center' }
        ],
        transferHeaders: [
          { text: 'Origin', value: 'origin', align: 'center' },
          { text: 'Destination', value: 'destination', align: 'center' },
          { text: 'Effective Date', value: 'effective_date', align: 'center' },
          { text: 'Transfer Fee', value: 'fee', align: 'center' }
        ],
        defaultPagination: {
          rowsPerPage: -1
        },
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
      histories () {
        return this.player.player_histories
      },
      ovrGrowth () {
        return this.histories.map(h => [ h.datestamp, h.ovr ])
      },
      valueGrowth () {
        return this.histories.map(h => [ h.datestamp, h.value ])
      }
    },
    async fetch ({ store, params }) {
      await store.dispatch('team/get', { teamId: params.teamId, activate: true })
      await store.dispatch('player/get', { playerId: params.playerId })
    },
    mounted () {
      this.setContracts()
      this.setLoans()
      this.setInjuries()
      this.setTransfers()
    },
    methods: {
      ...mapActions({
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
