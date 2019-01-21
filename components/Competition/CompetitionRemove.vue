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
            v-text="'mdi-minus-circle'"
            color="black"
          />
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
        v-text="'Yes'"
        @click="removeCompetition"
        dark
        flat
      />
      <v-btn
        v-text="'No'"
        @click.stop="snackbar = false"
        dark
        flat
      />
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
        this.$store.dispatch(
          'entities/competitions/REMOVE',
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
