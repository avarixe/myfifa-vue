<template>
  <v-timeline-item
    icon="mdi-ambulance"
    color="pink"
    fill-dot
    right
  >
    <template #opposite>
      <span class="headline font-weight-bold pink--text">
        {{ injury.description }} Injury
      </span>
      <h4 class="title font-weight-light mb-3 pink--text">
        {{ injury.started_on | formatDate }} -
        <span v-if="injury.ended_on">{{ injury.ended_on | formatDate }}</span>
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
        <div class="pink--text">
          <span class="title font-weight-bold">
            {{ injury.description }} Injury
          </span>
          <h4 class="body-2 font-weight-light mb-3">
            {{ injury.started_on | formatDate }} -
            <span v-if="injury.ended_on">{{ injury.ended_on | formatDate }}</span>
            <span v-else>Present</span>
          </h4>
        </div>
      </v-card-title>
      <v-card-text class="py-0">
        <table>
          <tbody>
            <tr>
              <td class="font-weight-bold">Duration</td>
              <td class="pl-1">Injured for {{ length }}</td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
      <v-card-actions>
        <injury-form
          :player="player"
          :record="injury"
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
        </injury-form>
      </v-card-actions>
    </v-card>
  </v-timeline-item>
</template>

<script>
  import { formatDistance, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'
  import InjuryForm from '@/components/Injury/Form'

  export default {
    name: 'InjuryEvent',
    components: {
      InjuryForm
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      injury: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    computed: {
      length () {
        return formatDistance(
          parseISO(this.injury.ended_on || this.team.currently_on),
          parseISO(this.injury.started_on)
        )
      }
    }
  }
</script>
