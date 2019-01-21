<template>
  <v-timeline
    :dense="dense"
  >
    <v-timeline-item
      v-for="(item, i) in sortedItems"
      :key="i"
      :icon="`mdi-${item.icon}`"
      :color="item.color"
      fill-dot
      right
    >
      <template
        slot="opposite"
      >
        <span
          :class="`headline font-weight-bold ${item.color}--text`"
          v-text="item.title || item.type"
        />
        <h4
          :class="`headline font-weight-light mb-3 ${item.color}--text`"
          v-text="item.dateRange"
        />
      </template>

      <v-card
        dense
      >
        <v-card-title
          v-if="dense"
          :class="`${item.color} lighten-2 py-1`"
        >
          <span
            class="font-weight-bold pr-1 white--text"
            v-text="item.title || item.type"
          />
          <span
            class="font-weight-light pl-1 white--text"
            v-text="item.dateRange"
          />
        </v-card-title>
        <v-container>
          <v-layout>
            <v-flex
              xs12
            >
              <timeline-content
                :item="item"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
  import TimelineContent from './TimelineContent'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [ TeamAccessible ],
    components: {
      TimelineContent
    },
    props: {
      filter: {
        type: String,
        required: true
      },
      contracts: {
        type: Array,
        required: true
      },
      injuries: {
        type: Array,
        required: true
      },
      loans: {
        type: Array,
        required: true
      },
      transfers: {
        type: Array,
        required: true
      }
    },
    computed: {
      items () {
        return [
          ...this.contracts.map(contract => ({
            type: 'Contract',
            color: 'blue',
            icon: 'file-document',
            date: contract.effective_date,
            dateRange: `${this.$_formatDate(contract.effective_date)} - ${this.$_formatDate(contract.end_date)}`,
            data: contract
          })),
          ...this.injuries.map(injury => ({
            type: 'Injury',
            color: 'pink',
            icon: 'hospital',
            date: injury.start_date,
            dateRange: `${this.$_formatDate(injury.start_date)} - ${this.$_formatDate(injury.end_date)}`,
            title: `${injury.description} Injury`,
            data: injury
          })),
          ...this.loans.map(loan => ({
            type: 'Loan',
            color: 'indigo',
            icon: 'transit-transfer',
            date: loan.start_date,
            dateRange: `${this.$_formatDate(loan.start_date)} - ${this.$_formatDate(loan.end_date)}`,
            title: `On Loan at ${loan.destination}`,
            data: loan
          })),
          ...this.transfers.map(transfer => {
            const transferOut = transfer.origin === this.team.title
            return {
              type: 'Transfer',
              color: transferOut ? 'red' : 'green',
              icon: `airplane-${transferOut ? 'takeoff' : 'landing'}`,
              date: transfer.effective_date,
              dateRange: this.$_formatDate(transfer.effective_date),
              data: transfer
            }
          })
        ]
      },
      filteredItems () {
        return this.filter !== 'All'
          ? this.items.filter(item => item.type === this.filter)
          : this.items
      },
      sortedItems () {
        return this.$_orderBy(this.filteredItems, ['date'], ['desc'])
      },
      dense () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
          case 'sm':
            return true
          default:
            return false
        }
      }
    }
  }
</script>
