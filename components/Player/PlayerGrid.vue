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

      <v-btn-toggle
        v-model="mode"
        mandatory
        class="mx-3">
        <v-btn
          v-for="(opt, i) in modes"
          :key="i"
          flat>
          <v-icon :color="opt.color">{{ opt.icon }}</v-icon>
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
      no-data-text="No Players Recorded">
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
  import { mapState, mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
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
          { text: 'Overall',    color: 'green', icon: 'mdi-trending-up' },
          { text: 'Contract',   color: 'blue',  icon: 'mdi-file-document-outline' },
          { text: 'Statistics', color: 'red',   icon: 'mdi-numeric' }
        ],
        loading: false,
        pagination: {
          rowsPerPage: 10,
          sortBy: 'pos_idx'
        },
        filterActive: true,
        search: ''
      }
    },
    computed: {
      ...mapState('player', { players: 'list' }),
      currentMode () {
        return this.modes[this.mode]
      },
      actionWidth () {
        return this.mode === 0 ? 125 : 40
      },
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
        return Object.values(this.players)
          .filter(player => !this.filterActive || player.status)
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
