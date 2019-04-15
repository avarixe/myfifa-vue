<template>
  <div
    class="d-inline-block"
    @click.stop="snackbar = true"
  >
    <slot>
      <v-tooltip
        color="black"
        bottom
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon
            color="black"
          >mdi-minus-circle</v-icon>
        </v-btn>
        Remove
      </v-tooltip>
    </slot>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove {{ seasonLabel(competition.season) }} {{ competition.name }}?
      <v-btn
        @click="removeCompetition"
        dark
        flat
      >Yes</v-btn>
      <v-btn
        @click.stop="snackbar = false"
        dark
        flat
      >No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import {
    TeamAccessible
  } from '@/mixins'

  export default {
    mixins: [ TeamAccessible ],
    props: {
      competition: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    }),
    methods: {
      removeCompetition () {
        this.$store.dispatch(
          'competitions/REMOVE',
          this.competition.id
        )

        this.$router.push({
          name: 'teams-teamId-seasons',
          params: { teamId: this.competition.team_id }
        })
      }
    }
  }
</script>
