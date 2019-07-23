<template>
  <v-timeline :dense="dense">
    <v-timeline-item
      v-for="(item, i) in sortedItems"
      :key="i"
      :icon="`mdi-${item.icon}`"
      :color="item.color"
      fill-dot
      right
    >
      <template #opposite>
        <span :class="`headline font-weight-bold ${item.color}--text`">
          {{ item.title || item.type }}
        </span>
        <h4 :class="`headline font-weight-light mb-3 ${item.color}--text`">
          {{ item.dateRange }}
        </h4>
      </template>

      <v-card dense>
        <v-card-title
          v-if="dense"
          :class="`${item.color} lighten-2 py-1`"
        >
          <span class="title font-weight-bold pr-1 white--text">
            {{ item.title || item.type }}
          </span>
          <span class="body-2 font-weight-light pl-1 white--text">
            {{ item.dateRange }}
          </span>
        </v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12">
              <timeline-content :item="item" />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import TimelineContent from './Content'
  import { TeamAccessible } from '@/mixins'

  @Component({
    components: {
      TimelineContent
    }
  })
  export default class PlayerTimeline extends mixins(TeamAccessible) {
    @Prop(Array) contracts
    @Prop(Array) injuries
    @Prop(Array) loans
    @Prop(Array) transfers

    get items () {
      return [
        ...this.contracts.map(contract => ({
          type: 'Contract',
          color: 'blue',
          icon: 'file-document',
          date: contract.started_on,
          dateRange:
            this.$_formatDate(contract.started_on) +
            ' - ' +
            this.$_formatDate(contract.ended_on),
          data: contract
        })),
        ...this.injuries.map(injury => ({
          type: 'Injury',
          color: 'pink',
          icon: 'hospital',
          date: injury.started_on,
          dateRange:
            this.$_formatDate(injury.started_on) +
            ' - ' +
            this.$_formatDate(injury.ended_on),
          title: `${injury.description} Injury`,
          data: injury
        })),
        ...this.loans.map(loan => ({
          type: 'Loan',
          color: 'indigo',
          icon: 'transit-transfer',
          date: loan.started_on,
          dateRange:
            this.$_formatDate(loan.started_on) +
            ' - ' +
            this.$_formatDate(loan.ended_on),
          title: `On Loan at ${loan.destination}`,
          data: loan
        })),
        ...this.transfers.map(transfer => {
          const transferOut = transfer.origin === this.team.title
          return {
            type: 'Transfer',
            color: transferOut ? 'red' : 'green',
            icon: `airplane-${transferOut ? 'takeoff' : 'landing'}`,
            date: transfer.moved_on,
            dateRange: this.$_formatDate(transfer.moved_on),
            data: transfer
          }
        })
      ]
    }
    get sortedItems () {
      return this.$_orderBy(this.items, ['date'], ['desc'])
    }
    get dense () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          return true
        default:
          return false
      }
    }
  }
</script>
