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
      <v-btn
        :to="playerLink(item)"
        nuxt
        small
        text
        color="primary"
        class="text-capitalize"
      >
        {{ item.name }}
      </v-btn>
    </template>
    <template #item.dir="{ item }">
      <v-icon :color="item.dir === 'in' ? 'green' : 'red'">
        mdi-airplane-{{ item.dir === 'in' ? 'landing' : 'takeoff' }}
      </v-icon>
    </template>
    <template #item.fee="{ item }">
      <span :class="`${item.dir === 'in' ? 'red' : 'green'}--text`">
        {{ item.fee | formatMoney }}
        <span v-if="item.addon_clause">(+{{ item.addon_clause }}%)</span>
      </span>
    </template>
  </v-data-table>
</template>

<script>
  import { addYears, format, parseISO } from 'date-fns'
  import { Team, Player, Transfer } from '@/models'

  export default {
    name: 'SeasonTransferGrid',
    props: {
      season: { type: [String, Number], required: true }
    },
    data: () => ({
      headers: [
        { text: 'Effective Date', value: 'moved_on' },
        { text: 'Player', value: 'name' },
        { text: '', value: 'dir', align: 'center' },
        { text: 'Team', value: 'team' },
        { text: 'Fee', value: 'fee', align: 'right' }
      ]
    }),
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      },
      seasonStart () {
        let date = parseISO(this.team.started_on)
        date = addYears(date, parseInt(this.season))
        return format(date, 'yyyy-MM-dd')
      },
      seasonEnd () {
        let date = parseISO(this.team.started_on)
        date = addYears(date, parseInt(this.season) + 1)
        return format(date, 'yyyy-MM-dd')
      },
      transfers () {
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
      },
      rows () {
        return this.transfers.map(transfer => ({
          ...transfer,
          name: transfer.player.name,
          dir: transfer.origin === this.team.title ? 'out' : 'in',
          team: transfer.origin === this.team.title
            ? transfer.destination
            : transfer.origin
        }))
      }
    },
    methods: {
      playerLink (transfer) {
        return {
          name: 'teams-teamId-players-playerId',
          params: {
            teamId: this.team.id,
            playerId: transfer.player_id
          }
        }
      }
    }
  }
</script>
