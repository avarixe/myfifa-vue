<template>
  <material-card
    title="Transfer History"
  >
    <v-card-title>

      <v-select
        v-model="seasonFilter"
        label="Season"
        :items="seasons"
        item-text="label"
        item-value="id"
        clearable
        hide-details
      />

      <v-spacer />

      <!-- Match Search -->
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      />
    </v-card-title>

    <!-- Match History Grid -->
    <v-data-table
      :headers="headers"
      :items="rows"
      :pagination.sync="pagination"
      :search="search"
      item-key="id"
      no-data-text="No Matches Recorded"
    >
      <template
        slot="headerCell"
        slot-scope="{ header }">
        <span
          class="subheading font-weight-light text-success text--darken-3"
          v-text="header.text"
        />
      </template>
      <template
        slot="items"
        slot-scope="props"
      >
        <transfer-row
          :transfer="props.item"
        />
      </template>
    </v-data-table>

  </material-card>
</template>

<script>
  import {
    Player,
    Transfer
  } from '@/models'
  import MaterialCard from '@/components/theme/Card'
  import TransferRow from './TransferRow'
  import {
    TeamAccessible
  } from '@/mixins'
  import {
    addYears
  } from 'date-fns'

  export default {
    mixins: [ TeamAccessible ],
    components: {
      MaterialCard,
      TransferRow
    },
    data () {
      return {
        pagination: {
          sortBy: 'effective_date',
          rowsPerPage: 10,
          descending: true
        },
        headers: [
          { text: 'Date', value: 'effective_date' },
          { text: 'Player', value: 'player.name' },
          { text: 'Origin', value: 'origin' },
          { text: 'Destination', value: 'destination' },
          { text: 'Fee', value: 'fee' }
        ],
        search: '',
        seasonFilter: null
      }
    },
    computed: {
      transfers () {
        const players = Player
          .query()
          .where('team_id', this.team.id)
          .get()
        return Transfer
          .query()
          .with('player')
          .where('player_id', players.map(p => p.id))
          .get()
      },
      rows () {
        const teamStart = this.$_parse(this.team.start_date)

        return this.transfers.filter(transfer => {
          if (typeof this.seasonFilter === 'number') {
            const transferDate = this.$_parse(transfer.effective_date)
            const seasonStart = addYears(teamStart, this.seasonFilter)
            const seasonEnd = addYears(teamStart, this.seasonFilter + 1)
            return seasonStart <= transferDate && transferDate < seasonEnd
          } else {
            return true
          }
        })
      },
      seasons () {
        let seasons = []

        for (let i = 0; i <= this.season; i++) {
          seasons.push({
            id: i,
            label: this.seasonLabel(i)
          })
        }

        return seasons
      }
    }
  }
</script>
