<template lang="pug">
  v-card(flat)
    v-card-text
      v-timeline(:dense="dense")
        v-timeline-item(
          v-for="(item, i) in sortedItems"
          :key="i"
          :icon="`mdi-${item.icon}`"
          :color="item.color"
          fill-dot
          right
        )
          template(#opposite)
            span.headline.font-weight-bold(:class="`${item.color}--text`")
              | {{ item.title || item.type }}
            h4.title.font-weight-light.mb-3(:class="`${item.color}--text`")
              | {{ item.dateRange }}
          v-card(dense flat)
            v-card-title.py-0(v-if="dense")
              div
                span.title.font-weight-bold(:class="`${item.color}--text`")
                  | {{ item.title || item.type }}
                h4.body-2.font-weight-light.mb-3(:class="`${item.color}--text`")
                  | {{ item.dateRange }}
            v-card-text.py-0
              timeline-content(:item="item")
            v-card-actions
              record-form(
                :player="player"
                :record="item.data"
                :type="item.type"
              )
                template(#default="{ on }")
                  v-btn(
                    text
                    small
                    color="orange"
                    v-on="on"
                  ) Edit
</template>

<script>
  import orderBy from 'lodash.orderby'
  import { format, parseISO } from 'date-fns'
  import TimelineContent from './Content'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'PlayerTimeline',
    components: {
      TimelineContent
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      player: {
        type: Object,
        required: true
      }
    },
    computed: {
      items () {
        return [
          ...this.player.contracts.map(contract => ({
            type: 'Contract',
            color: 'blue',
            icon: 'file-document',
            date: contract.started_on,
            dateRange:
              this.formatDate(contract.started_on) +
              ' - ' +
              this.formatDate(contract.ended_on),
            data: contract
          })),
          ...this.player.injuries.map(injury => ({
            type: 'Injury',
            color: 'pink',
            icon: 'ambulance',
            date: injury.started_on,
            dateRange:
              this.formatDate(injury.started_on) +
              ' - ' +
              this.formatDate(injury.ended_on),
            title: `${injury.description} Injury`,
            data: injury
          })),
          ...this.player.loans.map(loan => ({
            type: 'Loan',
            color: 'indigo',
            icon: 'transit-transfer',
            date: loan.started_on,
            dateRange:
              this.formatDate(loan.started_on) +
              ' - ' +
              this.formatDate(loan.ended_on),
            title: `On Loan at ${loan.destination}`,
            data: loan
          })),
          ...this.player.transfers.map(transfer => {
            const transferOut = transfer.origin === this.team.title
            return {
              type: 'Transfer',
              color: transferOut ? 'red' : 'green',
              icon: `airplane-${transferOut ? 'takeoff' : 'landing'}`,
              date: transfer.moved_on,
              dateRange: this.formatDate(transfer.moved_on),
              data: transfer
            }
          })
        ]
      },
      sortedItems () {
        return orderBy(this.items, 'date', 'desc')
      },
      dense () {
        switch (this.$vuetify.breakpoint.name) {
          case 'sm':
          case 'md':
            return false
          default:
            return true
        }
      }
    },
    methods: {
      formatDate (date) {
        return format(parseISO(date), 'MMM dd, yyyy')
      }
    }
  }
</script>
