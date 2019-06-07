<template>
  <v-card flat>
    <v-card-title>
      <!-- Display Menu -->
      <v-tooltip
        bottom
        :color="currentFilter.color"
      >
        <template #activator="{ on: tooltip }">
          <v-menu
            bottom
            right
          >
            <template #activator="{ on: menu }">
              <v-btn
                v-on="{ ...menu, ...tooltip }"
                class="px-1"
                text
              >
                <v-icon :color="currentFilter.color">
                  mdi-{{ currentFilter.icon }}
                </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(opt, i) in filters"
                :key="i"
                @click="filter = i"
              >
                <v-list-item-avatar>
                  <v-icon :color="opt.color">mdi-{{ opt.icon }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-title>{{ opt.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        Display {{ currentFilter.text }} Players
      </v-tooltip>

      <v-btn-toggle
        v-model="mode"
        mandatory
        rounded
        class="mx-3"
      >
        <v-btn
          v-for="(opt, i) in modes"
          :key="i"
          text
        >
          <v-icon :color="opt.color">mdi-{{ opt.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>

      <div :class="`subheading ${currentMode.color}--text`">
        {{ currentMode.text }}
      </div>

      <v-spacer />

      <!-- Player Search -->
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      ></v-text-field>
    </v-card-title>

    <!-- Player Information Grid -->
    <paged-table
      v-model="page"
      :page-count="pageCount"
    >
      <template #table>
        <v-data-table
          :headers="headers"
          :items="rows"
          :page.sync="page"
          :loading="loading"
          :sort-by="['pos_idx']"
          multi-sort
          :search="search"
          item-key="id"
          hide-default-footer
          :mobile-breakpoint="0"
          no-data-text="No Players Found"
          @page-count="pageCount = $event"
        >
          <template #item="{ item }">
            <player-row
              :player-data="item"
              :headers="headers"
              :mode="mode"
            />
          </template>
        </v-data-table>
      </template>
    </paged-table>

  </v-card>
</template>

<script>
  import { Player } from '@/models'
  import { PagedTable } from '@/helpers'
  import PlayerRow from './PlayerRow'

  export default {
    components: {
      PlayerRow,
      PagedTable
    },
    data () {
      return {
        mode: 0,
        modes: [
          {
            text: 'Overall',
            color: 'green',
            icon: 'trending-up'
          },
          {
            text: 'Edit',
            color: 'orange',
            icon: 'pencil'
          },
          {
            text: 'Contract',
            color: 'blue',
            icon: 'file-document-outline'
          },
          {
            text: 'Statistics',
            color: 'red',
            icon: 'numeric'
          }
        ],
        loading: false,
        page: 1,
        pageCount: 0,
        filter: 2,
        filters: [
          {
            text: 'All',
            color: 'blue',
            icon: 'earth'
          },
          {
            text: 'Youth',
            color: 'cyan',
            icon: 'school'
          },
          {
            text: 'Active',
            color: 'light-green',
            icon: 'account-check'
          },
          {
            text: 'Injured',
            color: 'pink',
            icon: 'hospital'
          },
          {
            text: 'Loaned',
            color: 'indigo',
            icon: 'transit-transfer'
          },
          {
            text: 'Pending',
            color: 'deep-orange',
            icon: 'lock-clock'
          }
        ],
        search: ''
      }
    },
    computed: {
      players () {
        return Player
          .query()
          .withAll()
          .where('team_id', parseInt(this.$route.params.teamId))
          .orderBy('ovr', 'desc')
          .get()
      },
      currentMode () { return this.modes[this.mode] },
      currentFilter () { return this.filters[this.filter] },
      actionWidth () { return this.mode === 0 ? 125 : 40 },
      headers () {
        let headers = [
          {
            text: 'Name',
            value: 'name',
            align: 'left'
          },
          {
            text: 'Status',
            value: 'status',
            align: 'center',
            width: 40
          },
          {
            text: 'Age',
            value: 'age',
            align: 'center'
          },
          {
            text: 'Position',
            value: 'pos_idx',
            align: 'center',
            view: 'pos'
          },
          {
            text: 'Kit No',
            value: 'kit_no',
            align: 'center'
          }
        ]

        switch (this.mode) {
          case 0: // Overall
            return headers.concat([
              {
                text: '2nd Position(s)',
                value: 'sec_pos',
                align: 'center',
                format: 'array'
              },
              {
                text: 'OVR',
                value: 'ovr',
                align: 'center'
              },
              {
                text: 'Value',
                value: 'value',
                align: 'right',
                format: 'money'
              }
            ])
          case 1: // Edit
            return [
              {
                text: '',
                value: 'edit',
                align: 'center',
                sortable: false
              },
              {
                text: 'Name',
                value: 'name',
                align: 'left'
              },
              {
                text: 'Position',
                value: 'pos_idx',
                align: 'center',
                view: 'pos'
              },
              {
                text: 'Kit No',
                value: 'kit_no',
                align: 'center',
                editable: true
              },
              {
                text: 'OVR',
                value: 'ovr',
                align: 'center',
                editable: true
              },
              {
                text: 'Value',
                value: 'value',
                align: 'right',
                format: 'money',
                editable: true
              }
            ]
          case 2: // Contract
            return headers.concat([
              {
                text: 'Value',
                value: 'value',
                align: 'right',
                format: 'money'
              },
              {
                text: 'Wage',
                value: 'contract.wage',
                align: 'right',
                format: 'money'
              },
              {
                text: 'End Date',
                value: 'contract.end_date',
                align: 'right',
                format: 'date'
              }
            ])
          case 3: // Statistics
            return headers.concat([
              {
                text: 'Games Played',
                value: 'matches.length',
                align: 'center'
              },
              {
                text: 'Goals',
                value: 'goals.length',
                align: 'center'
              },
              {
                text: 'Assists',
                value: 'assists.length',
                align: 'center'
              },
              {
                text: 'Clean Sheets',
                value: 'cleanSheets.length',
                align: 'center'
              }
            ])
        }
      },

      rows () {
        return this.players.filter(player => {
          switch (this.filter) {
            case 0: // All
              return true
            case 1: // Youth
              return player.youth && player.contracts.length === 0
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
    watch: {
      filterActive () {
        this.page = 1
      }
    }
  }
</script>

<style scoped>
  .v-card, .v-data-table {
    background-color: transparent;
  }
</style>
