<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    :mobile-breakpoint="0"
    disable-sort
    hide-default-footer
  >
    <template #item.moved_on="{ item }">
      {{ item.moved_on | formatDate }}
    </template>
    <template #item.name="{ item }">
      <nuxt-link
        :to="{ name: 'teams-teamId-players-playerId', params: { teamId: team.id, playerId: item.player_id } }"
      >
        {{ item.name }}
      </nuxt-link>
    </template>
    <template #item.origin="{ item }">
      <span :class="team.title === item.origin ? 'warning--text' : ''">
        {{ item.origin }}
      </span>
    </template>
    <template #item.dir="{ item }">
      <v-icon :color="item.dir === 'in' ? 'green' : 'red'">
        mdi-airplane-{{ item.dir === 'in' ? 'landing' : 'takeoff' }}
      </v-icon>
    </template>
    <template #item.destination="{ item }">
      <span :class="team.title === item.destination ? 'warning--text' : ''">
        {{ item.destination }}
      </span>
    </template>
    <template #item.fee="{ item }">
      <span :class="`${item.dir === 'in' ? 'red' : 'green'}--text`">
        {{ item.fee | formatMoney }}
        <span v-if="item.addon_clause">
          (+{{ item.addon_clause }}%)
        </span>
      </span>
    </template>
  </v-data-table>
</template>

<script>
  import { Component, Vue, Prop } from 'nuxt-property-decorator'
  import { addYears, format, parseISO } from 'date-fns'
  import { Team, Player, Transfer } from '@/models'

  @Component
  export default class SeasonTransferGrid extends Vue {
    @Prop({ type: [String, Number], required: true }) season

    headers = [
      { text: 'Effective Date', value: 'moved_on' },
      { text: 'Player', value: 'name' },
      { text: 'Origin', value: 'origin' },
      { text: '', value: 'dir', align: 'center', sortable: false },
      { text: 'Destination', value: 'destination' },
      { text: 'Fee', value: 'fee', align: 'right' }
    ]

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get seasonStart () {
      let date = parseISO(this.team.started_on)
      date = addYears(date, parseInt(this.season))
      return format(date, 'yyyy-MM-dd')
    }

    get seasonEnd () {
      let date = parseISO(this.team.started_on)
      date = addYears(date, parseInt(this.season) + 1)
      return format(date, 'yyyy-MM-dd')
    }

    get transfers () {
      const playerIds = Player
        .query()
        .where('team_id', this.team.id)
        .get()
        .map(player => player.id)

      return Transfer
        .query()
        .with('player.histories')
        .where('player_id', id => playerIds.indexOf(id) > -1)
        .where('moved_on', date => {
          return this.seasonStart <= date && date < this.seasonEnd
        })
        .get()
    }

    get rows () {
      return this.transfers.map(transfer => ({
        ...transfer,
        name: transfer.player.name,
        dir: transfer.origin === this.team.title ? 'out' : 'in'
      }))
    }
  }
</script>
