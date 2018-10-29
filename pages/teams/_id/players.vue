<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <player-form>
          <v-btn>
            <v-icon left>mdi-plus-circle-outline</v-icon>
            Player
          </v-btn>
        </player-form>
      </v-flex>
      <v-flex xs12>
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
                  :player="props.item"
                  :headers="headers"
                ></player-row>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import PlayerForm from '@/components/Player/PlayerForm'
  import PlayerRow from '@/components/Player/PlayerRow'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    components: {
      PlayerForm,
      PlayerRow
    },
    mixins: [ TeamAccessible ],
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('team/get', { teamId: params.id, activate: true }),
        store.dispatch('player/getAll', { teamId: params.id })
      ])
    },
    data () {
      return {
        display: 'status',
        modes: {
          status: {
            text: 'Status',
            icon: 'mdi-filter-variant'
          },
          contract: {
            text: 'Contract',
            icon: 'mdi-file-document-outline',
            color: 'blue'
          },
          analytics: {
            text: 'Analytics',
            icon: 'mdi-trending-up',
            color: 'green'
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
      ...mapState('player', {
        players: 'list'
      }),
      currentMode () {
        return this.modes[this.display]
      },
      headers () {
        let headers = [
          { text: 'Actions', value: '', align: 'center', format: 'actions', sortable: false },
          { text: 'Name',     value: 'name',   align: 'left' },
          { text: 'Kit No',   value: 'kit_no', align: 'center', editable: true },
          { text: 'Position', value: 'pos',    align: 'center' }
        ]

        switch (this.display) {
          case 'contract':
            return headers.concat([
              { text: 'Value',          value: 'value',                           align: 'center', format: 'money' },
              { text: 'Wage',           value: 'current_contract.wage',           align: 'center', format: 'money' },
              { text: 'End Date',       value: 'current_contract.end_date',       align: 'center', format: 'date' }
            ])
          case 'analytics':
            return headers.concat([
              { text: 'Games Played', value: 'num_games',   align: 'center' },
              { text: 'Goals',        value: 'num_goals',   align: 'center' },
              { text: 'Assists',      value: 'num_assists', align: 'center' },
              { text: 'Clean Sheets', value: 'num_cs',      align: 'center' }
            ])
          default: // Status
            return headers.concat([
              { text: '2nd Position(s)', value: 'sec_pos', align: 'center', format: 'array' },
              { text: 'OVR',             value: 'ovr',     align: 'center', editable: true },
              { text: 'Value',           value: 'value',   align: 'center', format: 'money', editable: true },
              { text: 'Status',          value: 'status',  align: 'center' }
            ])
        }
      },
      rows () {
        return Object.values(this.players)
          .sort((a, b) => a.pos_idx - b.pos_idx || b.ovr - a.ovr)
          .filter(player => !this.filterActive || player.status)
      }
    },
    watch: {
      'team.current_date' (val) {
        this.reloadTable()
      },
      filterActive () {
        this.pagination.page = 1
      },
      display (val) {
        if (val === 'analytics') {
          this.reloadStatistics()
        }
      }
    },
    methods: {
      ...mapActions('player', [
        'getAll',
        'getStatistics'
      ]),
      async reloadTable () {
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
          await this.getStatistics({
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

  >>> .v-small-dialog a {
    width: 100%;
  }
</style>
