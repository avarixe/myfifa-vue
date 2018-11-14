<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // PLAYERS
      </div>

      <!-- Display Menu -->
      <v-tooltip top>
        <v-menu slot="activator" bottom right>
          <v-btn slot="activator" icon>
            <v-icon :color="currentMode.color">
              {{ currentMode.icon }}
            </v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="(mode, key) in modes"
              :key="key"
              @click="display = key">
              <v-list-tile-avatar>
                <v-icon :color="mode.color">{{ mode.icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ mode.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        Display Mode
      </v-tooltip>

      <v-spacer></v-spacer>

      <!-- Player Search -->
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-text>

      <!-- Player Information Grid -->
      <v-data-table
        :headers="headers"
        :items="rows"
        :loading="loading"
        :pagination.sync="pagination"
        :search="search"
        item-key="id"
        disable-initial-sort
        no-data-text="No Players Recorded">
        <template slot="items" slot-scope="props">
          <player-row
            :player-data="props.item"
            :headers="headers"
          ></player-row>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import Vue from 'vue'
  import { mapState, mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import PlayerRow from '@/components/Player/PlayerRow'

  export default {
    components: {
      PlayerRow
    },
    mixins: [ TeamAccessible ],
    props: {
      season: {
        type: [String, Number],
        required: true
      }
    },
    data: () => ({
      display: 'growth',
      modes: {
        growth: {
          text: 'Growth',
          icon: 'mdi-trending-up',
          color: 'green'
        },
        statistics: {
          text: 'Statistics',
          icon: 'mdi-numeric',
          color: 'red'
        },
        percentage: {
          text: 'Percentage',
          icon: 'mdi-percent',
          color: 'blue'
        }
      },
      loading: false,
      pagination: {
        rowsPerPage: 10
      },
      filterActive: true,
      search: '',
      seasonStats: {}
    }),
    computed: {
      ...mapState('player', { players: 'list' }),
      currentMode () {
        return this.modes[this.display]
      },
      headers () {
        let headers = [
          { text: 'Name',         value: 'name',       align: 'left' },
          { text: 'Position',     value: 'pos',        align: 'center' },
          { text: 'Games Played', value: 'numGames',   align: 'center' },
          { text: 'Goals',        value: 'numGoals',   align: 'center' },
          { text: 'Goals per 90 Min', value: 'numGoalsPer90', align: 'center', format: 'fixed' },
          { text: 'Assists',      value: 'numAssists', align: 'center' },
          { text: 'Assists per 90 Min', value: 'numAssistsPer90', align: 'center', format: 'fixed' },
          { text: 'Clean Sheets', value: 'numCs',      align: 'center' }
        ]
        return headers
      },
      rows () {
        return Object.values(this.seasonStats)
      }
    },
    watch: {
      season: {
        immediate: true,
        handler: async function (val) {
          this.seasonStats = {}

          const { data } = await this.analyze({
            teamId: this.team.id,
            season: val
          })
          await this.getPlayers({
            teamId: this.team.id,
            playerIds: data.player_ids
          })
          for (let playerId of data.player_ids) {
            const numGames = data.num_games[playerId] || 0
            const numMinutes = data.num_minutes[playerId] || 1
            const numGoals = data.num_goals[playerId] || 0
            const numAssists = data.num_assists[playerId] || 0
            const numCs = data.num_cs[playerId] || 0
            const numGoalsPer90 = numGoals / numMinutes * 90
            const numAssistsPer90 = numAssists / numMinutes * 90

            Vue.set(this.seasonStats, playerId, {
              name: this.players[playerId].name,
              pos: this.players[playerId].pos,
              pos_index: this.players[playerId].pos_idx,
              numGames,
              numMinutes,
              numGoals,
              numAssists,
              numCs,
              numGoalsPer90,
              numAssistsPer90
            })
          }
        }
      }
    },
    methods: {
      ...mapActions({
        getPlayers: 'player/getAll',
        analyze: 'team/analyzeSeason'
      })
    }
  }
</script>

<style scoped>
  >>> table.v-table tbody tr td {
    padding: 8px 16px;
    height: auto;
  }
</style>
