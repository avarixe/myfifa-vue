<template>
  <timeline timeline-theme="slategray">
    <timeline-item
      v-for="(item, i) in sortedItems"
      :key="i">
      {{ item.dateRange }}
      <v-expansion-panel popout>
        <v-expansion-panel-content>
          <div slot="header">
            <v-icon left small :color="item.color">
              {{ item.icon }}
            </v-icon>
            {{ item.title || item.type }}
          </div>
          <v-card>
            <v-card-text>
              <timeline-item-content :item="item"></timeline-item-content>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </timeline-item>
  </timeline>
</template>

<script>
  import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
  import TimelineItemContent from '@/components/Player/Timeline/ItemContent'
  import TeamAction from '@/mixins/TeamAction'

  export default {
    mixins: [ TeamAction ],
    components: {
      Timeline,
      TimelineItem,
      TimelineTitle,
      TimelineItemContent
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
            icon: 'description',
            date: contract.effective_date,
            dateRange: `${this.$_formatDate(contract.effective_date)} - ${this.$_formatDate(contract.end_date)}`,
            data: contract
          })),
          ...this.injuries.map(injury => ({
            type: 'Injury',
            color: 'pink',
            icon: 'local_hospital',
            date: injury.start_date,
            dateRange: `${this.$_formatDate(injury.start_date)} - ${this.$_formatDate(injury.end_date)}`,
            title: `${injury.description} Injury`,
            data: injury
          })),
          ...this.loans.map(loan => ({
            type: 'Loan',
            color: 'indigo',
            icon: 'transfer_within_a_station',
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
              icon: `flight_${transferOut ? 'takeoff' : 'land'}`,
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
        return this.filteredItems.sort((a, b) => a.date < b.date)
      }
    }
  }
</script>
