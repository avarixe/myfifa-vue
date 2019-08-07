<template>
  <v-card>
    <v-toolbar flat>
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
    </v-toolbar>

    <!-- Match History Grid -->
    <v-card-text>
      <paged-table
        v-model="page"
        :page-count="pageCount"
      >
        <template #table>
          <v-data-table
            :headers="headers"
            :items="rows"
            :page.sync="page"
            sort-by="moved_on"
            sort-desc
            :search="search"
            item-key="id"
            hide-default-footer
            no-data-text="No Matches Recorded"
            @page-count="pageCount = $event"
          >
            <template #item.moved_on="{ item: transfer }">
              {{ $_format($_parse(transfer.moved_on), 'MMM DD, YYYY') }}
            </template>
            <template #item.player.name="{ item: transfer }">
              <v-btn
                :to="transfer.player.link"
                nuxt
                small
                text
                color="info"
                v-text="transfer.player.name"
              />
            </template>
            <template #item.fee="{ item: transfer }">
              <span :class="`${isTransferOut(transfer) ? 'green' : 'red'}--text`">
                {{ $_formatMoney(transfer.fee) }}
              </span>
            </template>
          </v-data-table>
        </template>
      </paged-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { Player, Transfer } from '@/models'
  import { PagedTable } from '@/helpers'
  import { TeamAccessible } from '@/mixins'
  import { addYears } from 'date-fns'

  @Component({
    components: {
      PagedTable
    }
  })
  export default class TransferGrid extends mixins(TeamAccessible) {
    headers = [
      { text: 'Date', value: 'moved_on' },
      { text: 'Player', value: 'player.name' },
      { text: 'Origin', value: 'origin' },
      { text: 'Destination', value: 'destination' },
      { text: 'Fee', value: 'fee', align: 'end' }
    ]
    search = ''
    page = 1
    pageCount = 0
    seasonFilter = null

    get transfers () {
      const players = Player
        .query()
        .where('team_id', this.team.id)
        .get()
      return Transfer
        .query()
        .with('player')
        .where('player_id', players.map(p => p.id))
        .get()
    }

    get rows () {
      const teamStart = this.$_parse(this.team.started_on)

      return this.transfers.filter(transfer => {
        if (typeof this.seasonFilter === 'number') {
          const transferDate = this.$_parse(transfer.moved_on)
          const seasonStart = addYears(teamStart, this.seasonFilter)
          const seasonEnd = addYears(teamStart, this.seasonFilter + 1)
          return seasonStart <= transferDate && transferDate < seasonEnd
        } else {
          return true
        }
      })
    }

    get seasons () {
      let seasons = []

      for (let i = 0; i <= this.season; i++) {
        seasons.push({
          id: i,
          label: this.seasonLabel(i)
        })
      }

      return seasons
    }

    isTransferOut (transfer) {
      return transfer.origin === this.team.title
    }
  }
</script>
