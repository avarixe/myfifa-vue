<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-human"
    title="Record Penalty Shootout"
    :submit="submit"
    :color="color"
  >
    <slot
      slot="activator"
    />

    <v-container
      slot="form"
    >
      <v-layout
        wrap
      >
        <v-flex
          xs6
        >
          <v-text-field
            v-model="penaltyShootout.home_score"
            :rules="$_validate('Home Score', ['required'])"
            type="number"
            :label="match.home"
            prepend-icon="mdi-soccer"
          />
        </v-flex>
        <v-flex
          xs6
        >
          <v-text-field
            v-model="penaltyShootout.away_score"
            :rules="$_validate('Away Score', ['required'])"
            type="number"
            :label="match.away"
            prepend-icon="mdi-soccer"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import {
    TeamAccessible,
    DialogFormable,
    MatchAccessible
  } from '@/mixins'

  export default {
    mixins: [
      DialogFormable,
      TeamAccessible,
      MatchAccessible
    ],
    data () {
      return {
        penaltyShootout: {
          home_score: null,
          away_score: null
        }
      }
    },
    methods: {
      async submit () {
        await this.$store.dispatch('penaltyShootout/CREATE', {
          matchId: this.match.id,
          penaltyShootout: this.penaltyShootout
        })
      }
    }
  }
</script>
