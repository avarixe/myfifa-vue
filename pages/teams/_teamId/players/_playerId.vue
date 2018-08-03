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
                <div class="display-1">{{ listArray(player.sec_pos) }}</div>
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
            <div class="headline">Evaluation History</div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-data-table
              :headers="historyHeaders"
              :items="player.player_histories"
              item-key="id"
              :pagination.sync="defaultPagination"
              hide-details
              hide-actions>
              <template slot="items" slot-scope="props">
                <tr>
                  <td class="text-xs-center">{{ $_format($_parse(props.item.datestamp), 'MMM DD, YYYY') }}</td>
                  <td class="text-xs-center">{{ props.item.ovr }}</td>
                  <td class="text-xs-center">{{ formatMoney(props.item.value) }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>

      <!-- <v-flex xs12> -->
        <!-- <v-card> -->
          <!-- <v-card-title> -->
            <!-- <div class="headline">Contracts</div> -->
          <!-- </v-card-title> -->
          <!-- <v-divider></v-divider> -->
          <!-- <v-card-text> -->
            <!-- <v-data-table -->
              <!-- :headers="contractHeaders" -->
              <!-- :items="contracts" -->
              <!-- item-key="id" -->
              <!-- :pagination.sync="defaultPagination" -->
              <!-- hide-details -->
              <!-- hide-actions -->
              <!-- no-data-text="No Contracts Recorded"> -->
              <!-- <template slot="items" slot-scope="props"> -->
                <!-- <tr> -->
                  <!-- <td class="text-xs-center">{{ $_format($_parse(props.item.effective_date), 'MMM DD, YYYY') }}</td> -->
                  <!-- <td class="text-xs-center">{{ $_format($_parse(props.item.end_date), 'MMM DD, YYYY') }}</td> -->
                  <!-- <td class="text-xs-center">{{ formatMoney(props.item.wage) }}</td> -->
                  <!-- <td class="text-xs-center">{{ formatMoney(props.item.signing_bonus) }}</td> -->
                <!-- </tr> -->
              <!-- </template> -->
            <!-- </v-data-table> -->
          <!-- </v-card-text> -->
        <!-- </v-card> -->
      <!-- </v-flex> -->
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'

  export default {
    middleware: 'authenticated',
    mixins: [ TeamAction ],
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
        defaultPagination: {
          rowsPerPage: -1
        }
      }
    },
    computed: {
      ...mapState('player', {
        players: 'list'
      }),
      player () {
        return this.players[this.$route.params.playerId]
      },
      contracts () {
        return []
        // return this.player.contracts.reduce((arr, c) => {
        //   return arr + c.contract_histories
        // }, [])
      }
    },
    async fetch ({ store, params }) {
      await store.dispatch('team/get', { teamId: params.teamId, activate: true })
      await store.dispatch('player/get', { playerId: params.playerId })
    },
    methods: {
      listArray (arr) {
        return arr && arr.length > 0
          ? arr.join(', ')
          : 'N/A'
      },
      formatMoney (amount) {
        return amount
          ? this.team.currency + parseInt(amount).toLocaleString()
          : 'N/A'
      }
    }
  }
</script>
