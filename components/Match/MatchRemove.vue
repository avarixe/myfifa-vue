<template>
  <div
    class="d-inline-block"
    @click.stop="snackbar = true"
  >
    <slot>
      <v-tooltip
        bottom
        color="black"
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon
            color="black"
            v-text="'mdi-minus-circle'"
          />
        </v-btn>
        Remove
      </v-tooltip>
    </slot>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove Match: {{ match.home }} v {{ match.away }}?
      <v-btn
        dark
        flat
        @click="removeMatch"
        v-text="'Yes'"
      />
      <v-btn
        dark
        flat
        @click.stop="snackbar = false"
        v-text="'No'"
      />
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    }),
    methods: {
      removeMatch () {
        this.$store.dispatch('entities/matches/REMOVE', this.match.id)
        this.$router.push({
          name: 'teams-teamId-matches',
          params: { teamId: this.match.team_id }
        })
      }
    }
  }
</script>
