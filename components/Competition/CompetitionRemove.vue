<template>
  <div class="d-inline-block" @click.stop="snackbar = true">
    <slot>
      <v-tooltip bottom color="black">
        <v-btn icon slot="activator">
          <v-icon color="black">mdi-minus-circle</v-icon>
        </v-btn>
        Remove
      </v-tooltip>
    </slot>
    <v-snackbar
      v-model="snackbar"
      color="black">
      Remove {{ seasonLabel(competition.season) }} {{ competition.name }}?
      <v-btn dark flat @click="removeCompetition">Yes</v-btn>
      <v-btn dark flat @click.stop="snackbar = false">No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'

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
        this.$store.dispatch('competition/remove', this.competition.id)
        this.$router.push({
          name: 'teams-id',
          params: { id: this.competition.team_id }
        })
      }
    }
  }
</script>
