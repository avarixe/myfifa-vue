<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout wrap>
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">{{ player.name }}</div>
      </v-flex>

      <v-layout
        class="text-xs-center"
        wrap
      >
        <v-flex xs6 sm3>
          <div class="display-1">{{ player.pos }}</div>
          <div class="subheading">Position</div>
        </v-flex>
        <v-flex xs6 sm3>
          <div class="display-1">{{ $_listArray(player.sec_pos) }}</div>
          <div class="subheading">Secondary Position(s)</div>
        </v-flex>
        <v-flex xs6 sm3>
          <div class="display-1">{{ player.age }}</div>
          <div class="subheading">Age</div>
        </v-flex>
        <v-flex xs6 sm3>
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
          <template v-if="player.isActive">
            <injury-form :player="player" />
            <loan-form :player="player" />
            <player-retire :player="player" />
            <player-release :player="player" />
          </template>
          <record-remove
            :record="player"
            store="players"
            :label="player.name"
            :redirect="playersPage"
          />
        </v-flex>
      </v-layout>

      <v-flex xs12>
        <v-card outlined>
          <v-card-text>
            <v-layout
              class="text-xs-center"
              wrap
            >
              <v-flex xs12 sm6>
                <div class="display-1 success--text">{{ player.ovr }}</div>
                <div class="subheading">OVR</div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="display-1 primary--text">{{ $_formatMoney(player.value) }}</div>
                <div class="subheading">Value</div>
              </v-flex>

              <v-flex xs6 sm3>
                <div class="display-1 teal--text">{{ player.matches.length }}</div>
                <div class="subheading">Matches</div>
              </v-flex>

              <v-flex xs6 sm3>
                <div class="display-1 pink--text">{{ player.cleanSheets.length }}</div>
                <div class="subheading">Clean Sheets</div>
              </v-flex>

              <v-flex xs6 sm3>
                <div class="display-1 blue--text">{{ player.goals.length }}</div>
                <div class="subheading">Goals</div>
              </v-flex>

              <v-flex xs6 sm3>
                <div class="display-1 orange--text">{{ player.assists.length }}</div>
                <div class="subheading">Assists</div>
              </v-flex>
            </v-layout>

            <v-tabs
              v-model="tab"
              centered
            >
              <v-tab>Timeline</v-tab>
              <v-tab>Growth</v-tab>
              <v-tab>Performance</v-tab>
              <v-tab>Partnerships</v-tab>
            </v-tabs>

            <v-tabs-items
              v-model="tab"
              touchless
            >
              <!-- Timeline -->
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    <player-timeline
                      :contracts="player.contracts"
                      :injuries="player.injuries"
                      :loans="player.loans"
                      :transfers="player.transfers"
                    />
                  </v-card-text>
                </v-card>
              </v-tab-item>

              <!-- Growth -->
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    <v-layout
                      class="text-xs-center"
                      wrap
                    >
                      <v-flex xs12>
                        <player-history-chart
                          :player="player"
                          attribute="ovr"
                          label="Overall Rating"
                          color="#4caf50"
                          :min="40"
                          :max="100"
                        />
                      </v-flex>

                      <v-flex xs12>
                        <player-history-chart
                          :player="player"
                          attribute="value"
                          label="Value"
                          color="#1976d2"
                          :prefix="team.currency"
                          thousands=","
                        />
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>

              <!-- Performance -->
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    <player-performance-table :player="player" />
                  </v-card-text>
                </v-card>
              </v-tab-item>

              <!-- Partnerships -->
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    <player-partnerships-table :player="player" />
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { Player } from '@/models'
  import PlayerForm from '@/components/Player/Form'
  import ContractForm from '@/components/Contract/Form'
  import InjuryForm from '@/components/Injury/Form'
  import LoanForm from '@/components/Loan/Form'
  import TransferForm from '@/components/Transfer/Form'
  import PlayerRetire from '@/components/Player/Retire'
  import PlayerRelease from '@/components/Player/Release'
  import PlayerTimeline from '@/components/Player/Timeline'
  import PlayerPerformanceTable from '@/components/Player/PerformanceTable'
  import PlayerPartnershipsTable from '@/components/Player/PartnershipsTable'
  import PlayerHistoryChart from '@/components/Charts/PlayerHistoryChart'
  import { RecordRemove } from '@/helpers'
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
      PlayerTimeline,
      PlayerPerformanceTable,
      PlayerPartnershipsTable,
      PlayerHistoryChart,
      RecordRemove
    },
    middleware: 'authenticated',
    mixins: [
      TeamAccessible
    ],
    head () {
      return {
        title: this.player.name
      }
    },
    data: () => ({
      tab: 0
    }),
    computed: {
      player () {
        return Player
          .query()
          .withAll()
          .with('matches.team')
          .find(this.$route.params.playerId)
      },
      playersPage () {
        return {
          name: 'teams-teamId-players',
          params: { teamId: this.team.id }
        }
      }
    },
    async fetch ({ store, params }) {
      await store.dispatch('players/GET_HISTORY', params)
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
