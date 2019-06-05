<template>
  <v-card flat>
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
    <paged-table
      v-model="page"
      :page-count="pageCount"
    >
      <template #table>
        <v-data-table
          :headers="headers"
          :items="rows"
          :page.sync="page"
          sort-by="effective_date"
          sort-desc
          :search="search"
          item-key="id"
          hide-default-footer
          mobile-breakpoint="0"
          no-data-text="No Matches Recorded"
          @page-count="pageCount = $event"
        >
          <template #item.effective_date="{ item: transfer }">
            {{ $_format($_parse(transfer.effective_date), 'MMM DD, YYYY') }}
          </template>
          <template #item.fee="{ item: transfer }">
            <span :class="`${isTransferOut(transfer) ? 'green' : 'red'}--text`">
              {{ $_formatMoney(transfer.fee) }}
            </span>
          </template>
        </v-data-table>
      </template>
    </paged-table>
  </v-card>
</template>

<script>
  import { Player, Transfer } from '@/models'
  import { PagedTable } from '@/helpers'
  import { TeamAccessible } from '@/mixins'
  import { addYears } from 'date-fns'

  export default {
    components: {
      PagedTable
    },
    mixins: [
      TeamAccessible
    ],
    data () {
      return {
        headers: [
          {
            text: 'Date',
            value: 'effective_date'
          },
          {
            text: 'Player',
            value: 'player.name'
          },
          {
            text: 'Origin',
            value: 'origin'
          },
          {
            text: 'Destination',
            value: 'destination'
          },
          {
            text: 'Fee',
            value: 'fee'
          }
        ],
        search: '',
        page: 1,
        pageCount: 0,
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
    },
    methods: {
      isTransferOut (transfer) {
        return transfer.origin === this.team.title
      }
    }
  }
</script>

<style scoped>
  .v-card, .v-data-table {
    background-color: transparent;
  }
</style>
