<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // PLAYERS
      </div>

      <!-- New Player Form -->
      <player-form>
        <v-tooltip top>
          <v-btn slot="activator" flat icon>
            <v-icon>add_circle</v-icon>
          </v-btn>
          Add Player
        </v-tooltip>
      </player-form>

      <player-mass-update></player-mass-update>

      <v-tooltip top>
        <v-btn slot="activator" icon @click.native="filterActive = !filterActive">
          <v-icon>check_box{{ filterActive ? '' : '_outline_blank' }}</v-icon>
        </v-btn>
        Display {{ filterActive ? 'Active' : 'All' }} Players
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
        append-icon="search"
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
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import get from 'lodash.get'
  import TeamAction from '@/mixins/TeamAction'
  import PlayerForm from '@/components/Player/PlayerForm'
  import PlayerActions from '@/components/Player/PlayerActions'
  import PlayerMassUpdate from '@/components/Player/PlayerMassUpdate'

  export default {
    components: {
      PlayerForm,
      PlayerActions,
      PlayerMassUpdate
    },
    mixins: [ TeamAction ],
    data () {
      return {
        display: 'status',
        modes: {
          status: {
            text: 'Status',
            icon: 'filter_list'
          },
          contract: {
            text: 'Contract',
            icon: 'description',
            color: 'blue'
          },
          analytics: {
            text: 'Analytics',
            icon: 'trending_up',
            color: 'green'
          }
        },
        loading: false,
        pagination: {},
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
          { text: 'Name',     value: 'name',   align: 'left' },
          { text: 'Position', value: 'pos',    align: 'center' },
          { text: 'Kit No',    value: 'kit_no', align: 'center' }
        ]

        switch (this.display) {
          case 'contract':
            return headers.concat([
              { text: 'Value',          value: 'value',                           align: 'center', format: 'money' },
              { text: 'Wage',           value: 'current_contract.wage',           align: 'center', format: 'money' },
              { text: 'Effective Date', value: 'current_contract.effective_date', align: 'center', format: 'date' },
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
              { text: 'OVR',             value: 'ovr',     align: 'center' },
              { text: 'Value',           value: 'value',   align: 'center', format: 'money' },
              { text: 'Status',          value: 'status',  align: 'center', format: 'status' }
            ])
        }
      },
      rows () {
        return Object.values(this.players)
          .sort((a, b) => a.pos_idx - b.pos_idx)
          .filter(player => !this.filterActive || player.status)
      }
    },
    watch: {
      'team.current_date' (val) {
        this.reloadTable()
      },
      filterActive () {
        this.pagination.page = 1
      }
    },
    mounted () {
      this.reloadTable()
    },
    methods: {
      ...mapActions('player', [
        'getAll',
        'analyze'
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
            return this.$_format(this.$_parse(value), 'MMM D, YYYY')
          case 'years':
            return value + ' Years'
          default:
            return value
        }
      },
      async reloadTable () {
        this.loading = true

        try {
          await this.getAll({ teamId: this.team.id })
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
  >>> table.v-table tbody td {
    padding: 8px 16px;
    height: auto;
  }
</style>
