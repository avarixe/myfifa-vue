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
        <v-card-text>
          <record-form
            :player="player"
            :record="item.data"
            :type="item.type"
          >
            <template #default="{ on }">
              <v-btn
                absolute
                dark
                fab
                top
                right
                x-small
                color="orange"
                v-on="on"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </record-form>

          <timeline-content :item="item" />
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import TimelineContent from './Content'
  import RecordForm from '@/helpers/RecordForm'
  import { TeamAccessible } from '@/mixins'

  @Component({
    components: {
      TimelineContent,
      RecordForm
    }
  })
  export default class PlayerTimeline extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) player

    get items () {
      return [
        ...this.player.contracts.map(contract => ({
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
        ...this.player.injuries.map(injury => ({
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
        ...this.player.loans.map(loan => ({
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
        ...this.player.transfers.map(transfer => {
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
