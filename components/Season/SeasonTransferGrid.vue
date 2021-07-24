<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    sort-by="date"
    :mobile-breakpoint="0"
    hide-default-footer
    class="mt-2"
  >
    <template #item="{ item }">
      <tr>
        <td class="stick-left">
          <v-btn
            :to="`/teams/${teamId}/players/${item.playerId}`"
            nuxt
            small
            text
            color="primary"
            class="text-capitalize"
          >
            {{ item.name }}
          </v-btn>
        </td>
        <td class="text-center">{{ item.pos }}</td>
        <td class="text-center">{{ item.date | formatDate }}</td>
        <td class="text-center">
          <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
        </td>
        <td>{{ item.fromTo }}</td>
        <td class="text-right">
          <span
            v-if="item.fee"
            :class="`${item.feeColor}--text`"
          >
            {{ item.feeColor === 'green' ? '+' : '-' }}
            {{ item.fee | formatMoney(team.currency, ' ') }}
            <span v-if="item.addonClause">(+{{ item.addonClause }}%)</span>
          </span>
        </td>
      </tr>
    </template>
    <template #foot>
      <tfoot class="font-weight-bold">
        <tr v-if="rows.length">
          <td class="stick-left">
            <span class="pl-3">Summary</span>
          </td>
          <td colspan="3" />
          <td class="py-2">
            <div>
              {{ numYouthPlayers }}
              <v-icon
                small
                color="cyan"
              >
                mdi-school
              </v-icon>
              Youth Academy
            </div>
            <div>
              {{ arrivals.length - numYouthPlayers }}
              <v-icon
                small
                color="blue"
              >
                mdi-human-greeting
              </v-icon>
              Free Arrivals
            </div>
            <div>
              {{ numTransfersIn }}
              <v-icon
                small
                color="green"
              >
                mdi-airplane-landing
              </v-icon>
              Transfers (In)
            </div>
            <div>
              {{ transfers.length - numTransfersIn }}
              <v-icon
                small
                color="red"
              >
                mdi-airplane-takeoff
              </v-icon>
              Transfers (Out)
            </div>
            <div>
              {{ departures.length }}
              <v-icon
                small
                color="purple"
              >
                mdi-exit-run
              </v-icon>
              Departures
            </div>
          </td>
          <td :class="`text-right ${total > 0 ? 'green' : 'red'}--text`">
            {{ total > 0 ? '+' : '-' }}
            {{ Math.abs(total) | formatMoney(team.currency, ' ') }}
          </td>
        </tr>
      </tfoot>
    </template>
  </v-data-table>
</template>

<script>
  import { format, parseISO, addYears } from 'date-fns'
  import { positions } from '@/constants'

  function sortPos (posA, posB) {
    return positions.indexOf(posA) - positions.indexOf(posB)
  }

  export default {
    name: 'SeasonTransferGrid',
    props: {
      transferActivity: { type: Object, required: true },
      season: { type: Number, required: true }
    },
    data: () => ({
      headers: [
        { text: 'Player', value: 'name', class: 'stick-left', width: 200 },
        { text: 'Pos', value: 'pos', align: 'center', sort: sortPos, width: 100 },
        { text: 'Date', value: 'date', align: 'center', width: 120 },
        { text: '', value: 'icon', align: 'center', sortable: false, width: 40 },
        { text: 'From/To', value: 'fromTo', width: 170 },
        { text: 'Fee', value: 'fee', align: 'end', class: 'text-right', width: 150 }
      ]
    }),
    computed: {
      teamId () {
        return parseInt(this.$route.params.teamId)
      },
      team () {
        return this.$store.$db().model('Team').find(this.teamId)
      },
      arrivals () {
        return this.transferActivity.arrivals.filter(arrival => {
          return !this.transfers.some(transfer => {
            return transfer.playerId === arrival.playerId &&
              transfer.date === arrival.startedOn &&
              transfer.iconColor === 'green'
          }) && !this.loans.some(loan => {
            return loan.playerId === arrival.playerId &&
              loan.date === arrival.startedOn &&
              loan.iconColor === 'indigo'
          }) && arrival.startedOn !== this.team.startedOn
        }).map(arrival => {
          const player = this.$store.$db().model('Player')
            .find(arrival.playerId)

          return {
            playerId: arrival.playerId,
            name: player.name,
            pos: player.pos,
            date: arrival.startedOn,
            icon: `mdi-${player.youth ? 'school' : 'human-greeting'}`,
            iconColor: player.youth ? 'cyan' : 'blue',
            fromTo: player.youth ? 'Youth Academy' : 'Free Agent'
          }
        })
      },
      departures () {
        return this.transferActivity.departures.map(departure => {
          const player = this.$store.$db().model('Player')
            .find(departure.playerId)
          return {
            playerId: departure.playerId,
            name: player.name,
            pos: player.pos,
            date: departure.endedOn,
            icon: 'mdi-exit-run',
            iconColor: 'purple',
            fromTo: `(${player.conclusion || 'Expired'})`
          }
        })
      },
      transfers () {
        return this.transferActivity.transfers.map(transfer => {
          const player = this.$store.$db().model('Player')
            .find(transfer.playerId)
          const transferOut = this.team.name === transfer.origin
          return {
            playerId: transfer.playerId,
            name: player.name,
            pos: player.pos,
            date: transfer.movedOn,
            icon: `mdi-airplane-${transferOut ? 'takeoff' : 'landing'}`,
            iconColor: transferOut ? 'red' : 'green',
            fromTo: transferOut ? transfer.destination : transfer.origin,
            fee: transfer.fee,
            feeColor: transferOut ? 'green' : 'red',
            addonClause: transfer.addonClause
          }
        })
      },
      loans () {
        return this.transferActivity.loans.reduce((loans, loan) => {
          const player = this.$store.$db().model('Player')
            .find(loan.playerId)
          const loanOut = this.team.name === loan.origin
          const row = {
            playerId: loan.playerId,
            name: player.name,
            pos: player.pos,
            fromTo: loanOut ? loan.destination : loan.origin
          }
          if (loan.startedOn >= this.seasonStart) {
            loans.push({
              ...row,
              date: loan.startedOn,
              icon: `mdi-account-arrow-${loanOut ? 'right' : 'left'}`,
              iconColor: `${loanOut ? 'orange' : 'light-green'}`
            })
          }
          if (loan.endedOn <= this.seasonEnd) {
            loans.push({
              ...row,
              date: loan.endedOn,
              icon: `mdi-account-arrow-${loanOut ? 'left' : 'right'}`,
              iconColor: `${loanOut ? 'light-green' : 'orange'}`
            })
          }
          return loans
        }, [])
      },
      rows () {
        // return []
        return [
          ...this.arrivals,
          ...this.departures,
          ...this.transfers,
          ...this.loans
        ].sort((a, b) => a.date - b.date)
      },
      total () {
        return this.transferActivity.transfers.reduce((total, transfer) => {
          if (transfer.origin === this.team.name) {
            return total + transfer.fee
          } else {
            return total - transfer.fee
          }
        }, 0)
      },
      numYouthPlayers () {
        return this.arrivals
          .filter(arrival => arrival.fromTo === 'Youth Academy')
          .length
      },
      numTransfersIn () {
        return this.transfers
          .filter(transfer => transfer.iconColor === 'green')
          .length
      },
      seasonStart () {
        const date = parseISO(this.team.startedOn)
        return format(addYears(date, this.season), 'yyyy-MM-dd')
      },
      seasonEnd () {
        const date = parseISO(this.seasonStart)
        return format(addYears(date, 1), 'yyyy-MM-dd')
      }
    }
  }
</script>
