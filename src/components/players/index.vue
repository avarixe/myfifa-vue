<template>
  <v-slide-x-reverse-transition>
    <v-card>
      <v-card-title primary-title>
        <div class="title">
          // PLAYERS
        </div>

        <!-- New Player Form -->
        <player-form :team-id="teamId">
          <v-tooltip top>
            <v-btn slot="activator" flat icon>
              <v-icon>add_circle</v-icon>
            </v-btn>
            Add Player
          </v-tooltip>
        </player-form>

        <player-mass-update :team-id="teamId"></player-mass-update>

        <!-- Display Menu -->
        <v-menu bottom right>
          <v-btn slot="activator" icon>
            <v-icon>menu</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="(mode, i) in modes"
              :key="i"
              @click="display = mode.value">
              <v-list-tile-title>{{ mode.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-spacer></v-spacer>

        <!-- Player Search -->
        <v-text-field
          v-model="search"
          label="Search"
          append-icon="search"
        ></v-text-field>
      </v-card-title>
      <v-card-text>

        <!-- Player Information Grid -->
        <v-data-table
          :headers="headers"
          :items="players"
          :pagination.sync="pagination"
          :loading="loading"
          :search="search"
          item-key="id"
          hide-actions
          no-data-text="No Players Recorded">
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td
                v-for="(header, i) in headers"
                :key="i"
                :class="'text-xs-' + header.align">
                {{ getProperty(props.item, header.value, header.format) }}
              </td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <player-actions :player="props.item"></player-actions>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2" v-if="pages > 1">
          <v-pagination
            v-model="pagination.page"
            :length="pages"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import get from 'lodash.get'
  import PlayerForm from '@/components/players/form'
  import PlayerActions from '@/components/players/actions'
  import PlayerMassUpdate from '@/components/players/mass_update'

  export default {
    data () {
      return {
        teamId: this.$route.params.teamId,
        pagination: {
          sortBy: 'posIdx'
        },
        display: 'ovr',
        modes: [
          { text: 'Status', value: 'status' },
          { text: 'Contract', value: 'contract' },
          { text: 'Analytics', value: 'analytics' }
        ],
        loading: false,
        search: ''
      }
    },
    computed: {
      ...mapState('player', {
        players: 'list'
      }),
      ...mapState('team', {
        team: 'active'
      }),
      headers () {
        let headers = [
          { text: 'Name',     value: 'name', align: 'left' },
          { text: 'Position', value: 'pos',  align: 'center' }
        ]

        switch (this.display) {
          case 'contract':
            return headers.concat([
             { text: 'Value',          value: 'value',                          align: 'center', format: 'money' },
             { text: 'Wage',           value: 'active_contract.wage',           align: 'center', format: 'money' },
             { text: 'Effective Date', value: 'active_contract.effective_date', align: 'center', format: 'date' },
             { text: 'End Date',       value: 'active_contract.end_date',       align: 'center', format: 'date' }
            ])
          default: // Status
            return headers.concat([
              { text: '2nd Position(s)', value: 'sec_pos', align: 'center', format: 'array' },
              { text: 'OVR',             value: 'ovr',     align: 'center' },
              { text: 'Value',           value: 'value',   align: 'center', format: 'money' },
              { text: 'Status',          value: 'status',  align: 'center', format: 'status' }
            ])
        }
      },
      pages () {
        return this.pagination.rowsPerPage == null || this.pagination.totalItems == null ? 0 : Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      }
    },
    watch: {
      'team.current_date' (val) {
        this.reloadTable()
      },
      players (val) {
        this.pagination.totalItems = val.length
      }
    },
    methods: {
      ...mapActions('player', [
        'refresh'
      ]),
      getProperty (player, property, outputFormat) {
        let value = get(player, property, '')

        if (!value) return '-'

        switch (outputFormat) {
          case 'money':
            return this.team.currency + value.toLocaleString()
          case 'array':
            return value.toString()
          case 'date':
            return this.$format(this.$parse(value), 'MMM D, YYYY')
          case 'years':
            return value + ' Years'
          default:
            return value
        }
      },
      reloadTable () {
        this.loading = true
        this.refresh({ teamId: this.teamId })
          .then((data) => { this.loading = false })
          .catch((error) => { alert(error.message) })
      }
    },
    mounted () {
      this.reloadTable()
    },
    components: {
      'player-form': PlayerForm,
      'player-actions': PlayerActions,
      'player-mass-update': PlayerMassUpdate
    }
  }
</script>

<style scoped>
  >>> table.v-table tbody td {
    padding: 8px 16px;
    height: auto;
  }
</style>