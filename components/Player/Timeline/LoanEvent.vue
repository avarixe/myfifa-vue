<template>
  <v-timeline-item
    icon="mdi-transit-transfer"
    color="indigo"
    fill-dot
    right
  >
    <template #opposite>
      <span class="text-h5 font-weight-bold indigo--text">
        Loan at {{ loan.destination }}
      </span>
      <h4 class="text-h6 font-weight-light mb-3 indigo--text">
        {{ loan.started_on | formatDate }} -
        <span v-if="loan.ended_on">{{ loan.ended_on | formatDate }}</span>
        <span v-else>Present</span>
      </h4>
    </template>
    <v-card
      dense
      flat
    >
      <v-card-title
        v-if="dense"
        class="py-0"
      >
        <div class="indigo--text">
          <span class="text-h6 font-weight-bold">
            Loan at {{ loan.destination }}
          </span>
          <h4 class="text-body-2 font-weight-light mb-3">
            {{ loan.started_on | formatDate }} -
            <span v-if="loan.ended_on">{{ loan.ended_on | formatDate }}</span>
            <span v-else>Present</span>
          </h4>
        </div>
      </v-card-title>
      <v-card-text class="py-0">
        <table>
          <tbody>
            <tr>
              <td class="font-weight-bold">Origin</td>
              <td class="pl-1">{{ loan.origin }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold">Destination</td>
              <td class="pl-1">{{ loan.destination }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold">Duration</td>
              <td class="pl-1">Away for {{ length }}</td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
      <v-card-actions>
        <loan-form
          :player="player"
          :record="loan"
        >
          <template #default="{ on }">
            <v-btn
              text
              small
              color="orange"
              v-on="on"
            >
              Edit
            </v-btn>
          </template>
        </loan-form>
      </v-card-actions>
    </v-card>
  </v-timeline-item>
</template>

<script>
  import { formatDistance, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'LoanEvent',
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      loan: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    computed: {
      length () {
        return formatDistance(
          parseISO(this.loan.ended_on || this.team.currently_on),
          parseISO(this.loan.started_on)
        )
      }
    }
  }
</script>
