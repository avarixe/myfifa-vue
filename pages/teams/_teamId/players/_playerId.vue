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

      <v-flex xs12>
        <v-card outlined>
          <v-card-text>
            <v-tabs>
              <v-tab>Statistics</v-tab>
              <v-tab>Timeline</v-tab>

              <v-tab-item>
                <v-layout
                  class="text-xs-center"
                  wrap
                >
                  <v-flex
                    xs12
                    sm6
                  >
                    <div class="display-1 success--text">{{ player.ovr }}</div>
                    <div class="subheading">OVR</div>
                  </v-flex>

                  <v-flex
                    xs12
                    sm6
                  >
                    <div class="display-1 blue-grey--text">{{ $_formatMoney(player.value) }}</div>
                    <div class="subheading">Value</div>
                  </v-flex>

                  <v-flex
                    xs12
                    sm3
                  >
                    <div class="display-1 teal--text">{{ player.matches.length }}</div>
                    <div class="subheading">Matches</div>
                  </v-flex>

                  <v-flex
                    xs12
                    sm3
                  >
                    <div class="display-1 blue--text">{{ player.goals.length }}</div>
                    <div class="subheading">Goals</div>
                  </v-flex>

                  <v-flex
                    xs12
                    sm3
                  >
                    <div class="display-1 orange--text">{{ player.assists.length }}</div>
                    <div class="subheading">Assists</div>
                  </v-flex>

                  <v-flex
                    xs12
                    sm3
                  >
                    <div class="display-1 pink--text">{{ player.cleanSheets.length }}</div>
                    <div class="subheading">Clean Sheets</div>
                  </v-flex>
                </v-layout>
              </v-tab-item>

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
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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
      PlayerTimeline
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
    computed: {
      player () {
        return Player
          .query()
          .withAll()
          .find(this.$route.params.playerId)
      },
      active () {
        return this.player.status && this.player.status.length > 0
      }
    },
    async fetch ({ store, params }) {
      await store.dispatch('players/GET_HISTORY', params)
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    },
    watch: {
      player (val) {
        !val && this.$router.push({
          name: 'teams-teamId-players',
          params: { teamId: this.team.id }
        })
      }
    }
  }
</script>
