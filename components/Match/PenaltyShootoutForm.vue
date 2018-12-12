<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-human"
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
            prepend-icon="mdi-soccer"
          ></v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model="penaltyShootout.away_score"
            :rules="$_validate('Away Score', ['required'])"
            type="number"
            :label="match.away"
            prepend-icon="mdi-soccer"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'
  import DialogFormable from '@/mixins/DialogFormable'
  import MatchAccessible from '@/mixins/MatchAccessible'

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
        await this.$store.dispatch('entities/penaltyShootout/CREATE', {
          matchId: this.match.id,
          penaltyShootout: this.penaltyShootout
        })
      }
    }
  }
</script>
