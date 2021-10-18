<script>
  import { toRefs, computed, useStore } from '@nuxtjs/composition-api'
  import { format, parseISO, addYears } from 'date-fns'
  import { useTeam } from '@/composables'
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
    setup (props) {
      const { team } = useTeam()

      const { transferActivity, season } = toRefs(props)
      const store = useStore()

      const arrivals = computed(() =>
        transferActivity.value.arrivals.filter(arrival => {
          return !transfers.value.some(transfer => {
            return transfer.playerId === arrival.playerId &&
              transfer.date === arrival.startedOn &&
              transfer.iconColor === 'green'
          }) && !loans.value.some(loan => {
            return loan.playerId === arrival.playerId &&
              loan.date === arrival.startedOn &&
              loan.iconColor === 'light-green'
          }) && arrival.startedOn !== team.value.startedOn
        }).map(arrival => {
          const player = store.$db().model('Player').find(arrival.playerId)

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
      )

      const departures = computed(() =>
        transferActivity.value.departures.map(departure => {
          const player = store.$db().model('Player').find(departure.playerId)
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
      )

      const transfers = computed(() =>
        transferActivity.value.transfers.map(transfer => {
          const player = store.$db().model('Player').find(transfer.playerId)
          const transferOut = team.value.name === transfer.origin
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
      )

      const seasonStart = computed(() => {
        const date = parseISO(team.value.startedOn)
        return format(addYears(date, season.value), 'yyyy-MM-dd')
      })

      const seasonEnd = computed(() => {
        const date = parseISO(seasonStart.value)
        return format(addYears(date, 1), 'yyyy-MM-dd')
      })

      const loans = computed(() =>
        transferActivity.value.loans.reduce((loans, loan) => {
          const player = store.$db().model('Player').find(loan.playerId)
          const loanOut = team.value.name === loan.origin
          const row = {
            playerId: loan.playerId,
            name: player.name,
            pos: player.pos,
            fromTo: loanOut ? loan.destination : loan.origin
          }
          if (loan.startedOn >= seasonStart.value) {
            loans.push({
              ...row,
              date: loan.startedOn,
              icon: `mdi-account-arrow-${loanOut ? 'right' : 'left'}`,
              iconColor: `${loanOut ? 'orange' : 'light-green'}`
            })
          }
          if (
            loan.endedOn <= seasonEnd.value &&
            !transfers.value.some(transfer => {
              return transfer.playerId === loan.playerId &&
                transfer.date === loan.endedOn
            })
          ) {
            loans.push({
              ...row,
              date: loan.endedOn,
              icon: `mdi-account-arrow-${loanOut ? 'left' : 'right'}`,
              iconColor: `${loanOut ? 'light-green' : 'orange'}`
            })
          }
          return loans
        }, [])
      )

      const rows = computed(() => [
        ...arrivals.value,
        ...departures.value,
        ...transfers.value,
        ...loans.value
      ].sort((a, b) => a.date - b.date))

      const total = computed(() =>
        transferActivity.value.transfers.reduce((total, transfer) => {
          if (transfer.origin === team.value.name) {
            return total + transfer.fee
          } else {
            return total - transfer.fee
          }
        }, 0)
      )

      const numYouthPlayers = computed(() =>
        arrivals.value.filter(arrival => arrival.fromTo === 'Youth Academy').length
      )

      const numTransfersIn = computed(() =>
        transfers.value.filter(transfer => transfer.iconColor === 'green').length
      )

      return {
        team,
        rows,
        numYouthPlayers,
        numTransfersIn,
        arrivals,
        transfers,
        departures,
        total,
        headers: [
          { text: 'Player', value: 'name', class: 'stick-left', width: 200 },
          { text: 'Pos', value: 'pos', align: 'center', sort: sortPos, width: 100 },
          { text: 'Date', value: 'date', align: 'center', width: 120 },
          { text: '', value: 'icon', align: 'center', sortable: false, width: 40 },
          { text: 'From/To', value: 'fromTo', width: 170 },
          { text: 'Fee', value: 'fee', align: 'end', class: 'text-right', width: 150 }
        ]
      }
    }
  }
</script>

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
            :to="`/teams/${team.id}/players/${item.playerId}`"
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
