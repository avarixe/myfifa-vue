<template>
  <v-card outlined>
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

      <div
        :class="`hidden-sm-and-down subheading ${currentMode.color}--text`">
        {{ currentMode.text }}
      </div>

      <v-spacer />

      <!-- Player Search -->
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      />
    </v-card-title>

    <!-- Player Information Grid -->
    <v-card-text>
      <paged-table
        v-model="page"
        :page-count="pageCount"
      >
        <template #table>
          <v-data-table
            :key="key"
            :headers="headers"
            :items="rows"
            :page.sync="page"
            :loading="loading"
            sort-by="pos"
            must-sort
            :search="search"
            item-key="id"
            hide-default-footer
            no-data-text="No Players Found"
            @page-count="pageCount = $event"
          >
            <template #item.name="{ item }">
              <v-btn
                :to="item.link"
                small
                text
                nuxt
                color="info"
              >{{ item.name }}</v-btn>
            </template>
            <template #item.kit_no="{ item }">
              <inline-field
                :item="item"
                attribute="kit_no"
                label="Kit No"
                input-type="select"
                :options="Array.from({ length: 98 }, (v, k) => k + 1)"
                @close="updatePlayerAttribute(item.id, 'kit_no', $event)"
              />
            </template>
            <template #item.ovr="{ item }">
              <inline-field
                :item="item"
                attribute="ovr"
                label="OVR"
                input-type="select"
                :options="Array.from({ length: 61 }, (v, k) => k + 40)"
                @close="updatePlayerAttribute(item.id, 'ovr', $event)"
              />
            </template>
            <template #item.value="{ item }">
              <inline-field
                :item="item"
                attribute="value"
                label="Value"
                input-type="money"
                :display="$_formatMoney(item.value)"
                @close="updatePlayerAttribute(item.id, 'value', $event)"
                required
              />
            </template>
            <template #item.status="{ item }">
              <v-icon :color="item.statusColor">
                mdi-{{ item.statusIcon }}
              </v-icon>
            </template>
            <template #item.sec_pos="{ item }">
              {{ $_listArray(item.sec_pos, '-') }}
            </template>
            <template #item.wage="{ item }">
              {{ contractWage(item) }}
            </template>
            <template #item.endDate="{ item }">
              {{ contractDate(item) }}
            </template>
          </v-data-table>
        </template>
      </paged-table>
    </v-card-text>

  </v-card>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import { Player } from '@/models'
  import { InlineField, PagedTable } from '@/helpers'
  import { positions } from '@/models/Player'

  @Component({
    components: {
      InlineField,
      PagedTable
    }
  })
  export default class PlayerGrid extends mixins(TeamAccessible) {
    key = 0
    mode = 0
    modes = [
      { text: 'Overall', color: 'green', icon: 'trending-up' },
      { text: 'Edit', color: 'orange', icon: 'pencil' },
      { text: 'Contract', color: 'blue', icon: 'file-document-outline' },
      { text: 'Statistics', color: 'red', icon: 'numeric' }
    ]
    loading = false
    page = 1
    pageCount = 0
    filter = 2
    filters = [
      { text: 'All', color: 'blue', icon: 'earth' },
      { text: 'Youth', color: 'cyan', icon: 'school' },
      { text: 'Active', color: 'light-green', icon: 'account-check' },
      { text: 'Injured', color: 'pink', icon: 'hospital' },
      { text: 'Loaned', color: 'indigo', icon: 'transit-transfer' },
      { text: 'Pending', color: 'deep-orange', icon: 'lock-clock' }
    ]
    search = ''

    get players () {
      return Player
        .query()
        .with('team|contracts|goals|assists|matches')
        .where('team_id', parseInt(this.$route.params.teamId))
        .get()
    }

    get currentMode () {
      return this.modes[this.mode]
    }

    get currentFilter () {
      return this.filters[this.filter]
    }

    get headers () {
      let headers = [
        { text: 'Name', value: 'name' },
        { text: 'Status', value: 'status', align: 'center', sortable: false, width: 40 },
        { text: 'Age', value: 'age', align: 'center' },
        { text: 'Position', value: 'pos', align: 'center', sort: this.sortPos },
        { text: 'Kit No', value: 'kit_no', align: 'center' }
      ]

      switch (this.mode) {
        case 0: // Overall
          return headers.concat([
            { text: '2nd Position(s)', value: 'sec_pos', sortable: false, align: 'center' },
            { text: 'OVR', value: 'ovr', align: 'center' },
            { text: 'Value', value: 'value', align: 'end' }
          ])
        case 1: // Edit
          return [
            { text: 'Name', value: 'name' },
            { text: 'Position', value: 'pos', align: 'center', sort: this.sortPos },
            { text: 'Kit No', value: 'kit_no', align: 'center' },
            { text: 'OVR', value: 'ovr', align: 'center' },
            { text: 'Value', value: 'value', align: 'end' }
          ]
        case 2: // Contract
          return headers.concat([
            { text: 'Value', value: 'value', align: 'end' },
            { text: 'Wage', value: 'wage', align: 'end' },
            { text: 'End Date', value: 'endDate', align: 'end' }
          ])
        case 3: // Statistics
          return headers.concat([
            { text: 'Games Played', value: 'matches.length', align: 'center' },
            { text: 'Goals', value: 'goals.length', align: 'center' },
            { text: 'Assists', value: 'assists.length', align: 'center' },
            { text: 'Clean Sheets', value: 'cleanSheets', align: 'center' }
          ])
      }
    }

    get rows () {
      return this.players
        .filter(player => {
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
        .map(player => {
          const cleanSheets = player.cleanSheets().length
          const contract = player.contract()

          return {
            ...player,
            link: player.link,
            cleanSheets,
            wage: contract.wage,
            endDate: contract.ended_on
          }
        })
    }

    async updatePlayerAttribute (playerId, attribute, value) {
      try {
        await this.$store.dispatch('players/UPDATE', {
          id: playerId,
          [attribute]: value
        })
      } catch (e) {
        this.key++
        this.$store.commit('broadcaster/ANNOUNCE', {
          message: e.message,
          color: 'red'
        })
      }
    }

    sortPos (posA, posB) {
      return positions.indexOf(posA) - positions.indexOf(posB)
    }

    contractWage (player) {
      const value = player.wage
      return value && this.$_formatMoney(value)
    }

    contractDate (player) {
      const value = player.endDate
      return value && this.$_format(this.$_parse(value), 'MMM D, YYYY')
    }
  }
</script>
