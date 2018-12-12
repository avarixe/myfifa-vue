<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // PLAYERS
      </div>

      <!-- Display Menu -->
      <v-tooltip bottom :color="currentFilter.color">
        <v-menu slot="activator" bottom right>
          <v-btn slot="activator" icon>
            <v-icon :color="currentFilter.color">
              mdi-{{ currentFilter.icon }}
            </v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="(opt, i) in filters"
              :key="i"
              @click="filter = i">
              <v-list-tile-avatar>
                <v-icon :color="opt.color">mdi-{{ opt.icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ opt.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        Display {{ currentFilter.text }} Players
      </v-tooltip>

      <v-btn-toggle
        v-model="mode"
        mandatory
        class="mx-3">
        <v-btn
          v-for="(opt, i) in modes"
          :key="i"
          flat>
          <v-icon :color="opt.color">mdi-{{ opt.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>

      <div :class="`subheading ${currentMode.color}--text`">
        {{ currentMode.text }}
      </div>

      <v-spacer></v-spacer>

      <!-- Player Search -->
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      ></v-text-field>
    </v-card-title>

    <!-- Player Information Grid -->
    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="loading"
      :pagination.sync="pagination"
      :search="search"
      item-key="id"
      must-sort
      no-data-text="No Players Found">
      <template slot="items" slot-scope="props">
        <player-row
          :player-data="props.item"
          :headers="headers"
          :action-width="actionWidth"
        ></player-row>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
  import { mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import { Player } from '@/models'
  import PlayerForm from './PlayerForm'
  import PlayerRow from './PlayerRow'

  export default {
    mixins: [ TeamAccessible ],
    components: {
      PlayerForm,
      PlayerRow
    },
    data () {
      return {
        mode: 0,
        modes: [
          { text: 'Overall',    color: 'green', icon: 'trending-up' },
          { text: 'Contract',   color: 'blue',  icon: 'file-document-outline' },
          { text: 'Statistics', color: 'red',   icon: 'numeric' }
        ],
        loading: false,
        pagination: {
          rowsPerPage: 10,
          sortBy: 'pos_idx'
        },
        filter: 2,
        filters: [
          { text: 'All', color: 'blue', icon: 'earth' },
          { text: 'Youth', color: 'cyan', icon: 'school' },
          { text: 'Active', color: 'bluegrey', icon: 'clipboard-account' },
          { text: 'Injured', color: 'pink', icon: 'hospital' },
          { text: 'Loaned', color: 'indigo', icon: 'transit-transfer' },
          { text: 'Pending', color: 'deep-orange', icon: 'lock-clock' }
        ],
        search: '',
        statistics: {
          num_games: {},
          num_goals: {},
          num_assists: {},
          num_cs: {}
        }
      }
    },
    computed: {
      players () {
        return Player
          .query()
          .where('team_id', this.team.id)
          .get()
          .map(player => ({
            ...player,
            num_games: this.statistics.num_games[player.id],
            num_goals: this.statistics.num_goals[player.id],
            num_assists: this.statistics.num_assists[player.id],
            num_cs: this.statistics.num_cs[player.id]
          }))
      },
      currentMode () { return this.modes[this.mode] },
      currentFilter () { return this.filters[this.filter] },
      actionWidth () { return this.mode === 0 ? 125 : 40 },
      headers () {
        let headers = [
          { text: '',         value: 'action',  align: 'center', sortable: false, width: this.actionWidth },
          { text: 'Name',     value: 'name',    align: 'left' },
          { text: 'Status',   value: 'status',  align: 'left', width: '40px' },
          { text: 'Age',      value: 'age',     align: 'center' },
          { text: 'Position', value: 'pos_idx', align: 'center', view: 'pos' },
          { text: 'Kit No',   value: 'kit_no',  align: 'center', editable: true }
        ]

        switch (this.mode) {
          case 0: // Overall
            return headers.concat([
              { text: '2nd Position(s)', value: 'sec_pos', align: 'center', format: 'array' },
              { text: 'OVR',             value: 'ovr',     align: 'center', editable: true },
              { text: 'Value',           value: 'value',   align: 'right',  format: 'money', editable: true }
            ])
          case 1: // Contract
            return headers.concat([
              { text: 'Value',    value: 'value',                     align: 'right', format: 'money' },
              { text: 'Wage',     value: 'current_contract.wage',     align: 'right', format: 'money' },
              { text: 'End Date', value: 'current_contract.end_date', align: 'right', format: 'date' }
            ])
          case 2: // Statistics
            return headers.concat([
              { text: 'Games Played', value: 'num_games',   align: 'center' },
              { text: 'Goals',        value: 'num_goals',   align: 'center' },
              { text: 'Assists',      value: 'num_assists', align: 'center' },
              { text: 'Clean Sheets', value: 'num_cs',      align: 'center' }
            ])
        }
      },
      rows () {
        return this.players.filter(player => {
          switch (this.filter) {
            case 0: // All
              return true
            case 1: // Youth
              return player.youth
            case 2: // Active
              return player.status
            case 3: // Injured
            case 4: // Loaned
            case 5: // Pending
              return player.status === this.currentFilter.text
          }
        })
      }
    },
    mounted () {
      this.reloadGrid()
    },
    watch: {
      filterActive () {
        this.pagination.page = 1
      },
      mode (val) {
        if (val === 2) {
          this.reloadStatistics()
        }
      }
    },
    methods: {
      ...mapActions('entities/players', {
        getAll: 'FETCH',
        analyze: 'ANALYZE'
      }),
      async reloadGrid () {
        this.loading = true

        try {
          await this.getAll({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
        }
      },
      async reloadStatistics () {
        this.loading = true

        try {
          const { data } = await this.analyze({
            teamId: this.team.id,
            playerIds: this.players.map(player => player.id)
          })
          this.statistics = data
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style scoped>
  >>> table.v-table tbody tr td {
    padding: 8px 16px;
    height: auto;
  }
</style>
