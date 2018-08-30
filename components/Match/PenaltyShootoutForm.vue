<template>
  <dialog-form
    v-model="dialog"
    title-icon="accessibility_new"
    title="Record Penalty Shootout"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs6>
          <v-text-field
            v-model="penaltyShootout.home_score"
            :rules="$_validate('Home Score', ['required'])"
            type="number"
            :label="match.home"
            prepend-icon="filter_tilt_shift"
          ></v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model="penaltyShootout.away_score"
            :rules="$_validate('Away Score', ['required'])"
            type="number"
            :label="match.away"
            prepend-icon="filter_tilt_shift"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import TeamAction from '@/mixins/TeamAction'
  import FormBase from '@/mixins/FormBase'
  import MatchEvent from '@/mixins/MatchEvent'

  export default {
    mixins: [
      FormBase,
      TeamAction,
      MatchEvent
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
        await this.$store.dispatch('penaltyShootout/create', {
          matchId: this.match.id,
          penaltyShootout: this.penaltyShootout
        })
      }
    }
  }
</script>
