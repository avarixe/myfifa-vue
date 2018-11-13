<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // PLAYERS
      </div>

      <v-tooltip top>
        <v-btn slot="activator" icon @click.native="filterActive = !filterActive">
          <v-icon>mdi-checkbox-{{ filterActive ? 'marked' : 'blank-outline' }}</v-icon>
        </v-btn>
        Display {{ filterActive ? 'All' : 'Active' }} Players
      </v-tooltip>

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
            :action-width="actionWidth"
          ></player-row>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import PlayerForm from '@/components/Player/PlayerForm'
  import PlayerRow from '@/components/Player/PlayerRow'

  export default {
    mixins: [ TeamAccessible ],
    components: {
      PlayerForm,
      PlayerRow
    },
    data () {
      return {
        display: 'rating',
        modes: {
          rating: {
            text: 'Rating',
            icon: 'mdi-trending-up',
            color: 'green'
          },
          contract: {
            text: 'Contract',
            icon: 'mdi-file-document-outline',
            color: 'blue'
          },
          statistics: {
            text: 'Statistics',
            icon: 'mdi-numeric',
            color: 'red'
          }
        },
        loading: false,
        pagination: {
          rowsPerPage: 10
        },
        filterActive: true,
        search: ''
      }
    },
    computed: {
      ...mapState('player', { players: 'list' }),
      currentMode () {
        return this.modes[this.display]
      },
      actionWidth () {
        return this.display === 'rating' ? 125 : 40
      },
      headers () {
        let headers = [
          { text: '',         value: 'action', align: 'center', sortable: false, width: this.actionWidth },
          { text: 'Name',     value: 'name',   align: 'left' },
          { text: 'Status',   value: 'status', align: 'left', width: '40px' },
          { text: 'Age',      value: 'age',    align: 'center' },
          { text: 'Position', value: 'pos',    align: 'center' },
          { text: 'Kit No',   value: 'kit_no', align: 'center', editable: true }
        ]

        switch (this.display) {
          case 'contract':
            return headers.concat([
              { text: 'Value',    value: 'value',                     align: 'right', format: 'money' },
              { text: 'Wage',     value: 'current_contract.wage',     align: 'right', format: 'money' },
              { text: 'End Date', value: 'current_contract.end_date', align: 'right', format: 'date' }
            ])
          case 'statistics':
            return headers.concat([
              { text: 'Games Played', value: 'num_games',   align: 'center' },
              { text: 'Goals',        value: 'num_goals',   align: 'center' },
              { text: 'Assists',      value: 'num_assists', align: 'center' },
              { text: 'Clean Sheets', value: 'num_cs',      align: 'center' }
            ])
          default: // Rating
            return headers.concat([
              { text: '2nd Position(s)', value: 'sec_pos', align: 'center', format: 'array' },
              { text: 'OVR',             value: 'ovr',     align: 'center', editable: true },
              { text: 'Value',           value: 'value',   align: 'right',  format: 'money', editable: true }
            ])
        }
      },
      rows () {
        return this.$_orderBy(
          Object.values(this.players),
          ['pos_idx', 'ovr'],
          ['asc', 'desc']
        ).filter(player => !this.filterActive || player.status)
      }
    },
    mounted () {
      this.reloadGrid()
    },
    watch: {
      filterActive () {
        this.pagination.page = 1
      },
      display (val) {
        if (val === 'statistics') {
          this.reloadStatistics()
        }
      }
    },
    methods: {
      ...mapActions('player', [
        'getAll',
        'analyze'
      ]),
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
          await this.analyze({
            teamId: this.team.id,
            playerIds: Object.keys(this.players)
          })
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
