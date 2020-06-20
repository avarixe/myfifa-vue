<template>
  <v-timeline-item
    color="indigo"
    icon="mdi-human"
    fill-dot
  >
    <h2 class="text-h5 font-weight-light my-0 indigo--text">
      {{ match.extra_time ? 120 : 90 }}"
      <span class="text-caption text-truncate mx-1 indigo--text">
        Penalty Shootout
      </span>
      <template v-if="!readonly">
        <penalty-shootout-form
          :match="match"
          :record="penaltyShootout"
        >
          <template #default="{ on }">
            <tooltip-button
              label="Edit Penalty Shootout"
              icon="mdi-pencil"
              color="orange"
              small
              :on="on"
            />
          </template>
        </penalty-shootout-form>
        <record-remove
          :record="penaltyShootout"
          store="penaltyShootout"
          label="Penalty Shootout"
        />
      </template>
    </h2>
    <b>{{ winner }}</b> wins by Penalty Shootout (<b>{{ score }}</b>)
  </v-timeline-item>
</template>

<script>
  export default {
    name: 'PenaltyShootoutEvent',
    props: {
      match: { type: Object, required: true },
      penaltyShootout: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      winner () {
        return this.penaltyShootout.home_score > this.penaltyShootout.away_score
          ? this.match.home
          : this.match.away
      },
      score () {
        const {
          home_score: homeScore,
          away_score: awayScore
        } = this.penaltyShootout
        return homeScore > awayScore
          ? `${homeScore} - ${awayScore}`
          : `${awayScore} - ${homeScore}`
      }
    }
  }
</script>
