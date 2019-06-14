<template>
  <div class="d-inline-block">
    <v-btn
      @click="snackbar = true"
      dark
      class="my-1"
    >Remove</v-btn>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove {{ seasonLabel(competition.season) }} {{ competition.name }}?
      <v-btn
        @click="removeCompetition"
        dark
        text
      >Yes</v-btn>
      <v-btn
        @click.stop="snackbar = false"
        dark
        text
      >No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    mixins: [
      TeamAccessible
    ],
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
