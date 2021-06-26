<template>
  <v-timeline-item
    color="indigo"
    icon="mdi-human"
    fill-dot
  >
    <template #icon>
      <v-sheet
        dark
        color="transparent"
        v-text="`${match.extra_time ? 120 : 90}'`"
      />
    </template>
    <h2 class="text-h5 font-weight-light my-0 indigo--text">
      <span class="text-caption text-truncate mx-1 indigo--text">
        Penalty Shootout
      </span>
      <template v-if="!readonly">
        <penalty-shootout-form
          :match="match"
          :record="penaltyShootout"
          class="d-inline-block"
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
    <div :class="{ 'font-weight-bold': match.home === winner }">
      {{ penaltyShootout.home_score }} - {{ match.home }}
    </div>
    <div :class="{ 'font-weight-bold': match.away === winner }">
      {{ penaltyShootout.away_score }} - {{ match.away }}
    </div>
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
