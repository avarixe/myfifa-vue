<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-human"
    title="Record Penalty Shootout"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <template #form>
      <v-container grid-list-xs>
        <v-layout wrap>
          <v-flex xs6>
            <v-text-field
              v-model="penaltyShootout.home_score"
              :rules="$_validate('Home Score', ['required'])"
              type="number"
              :label="match.home"
              prepend-icon="mdi-soccer"
            />
          </v-flex>
          <v-flex xs6>
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
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  const mix = mixins(TeamAccessible, DialogFormable, MatchAccessible)

  @Component
  export default class PenaltyShootoutForm extends mix {
    penaltyShootout = {
      home_score: null,
      away_score: null
    }

    async submit () {
      await this.$store.dispatch('penaltyShootout/CREATE', {
        matchId: this.match.id,
        penaltyShootout: this.penaltyShootout
      })
    }
  }
</script>
