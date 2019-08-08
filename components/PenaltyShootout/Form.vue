<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-human"
    title="Record Penalty Shootout"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Penalty Shootout"
          icon="mdi-human"
          color="indigo"
          :on="on"
        />
      </slot>
    </template>

    <template #form>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="penaltyShootout.home_score"
              :rules="$_validate('Home Score', ['required'])"
              type="number"
              :label="match.home"
              prepend-icon="mdi-soccer"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="penaltyShootout.away_score"
              :rules="$_validate('Away Score', ['required'])"
              type="number"
              :label="match.away"
              prepend-icon="mdi-soccer"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  const mix = mixins(TeamAccessible, DialogFormable, MatchAccessible)

  @Component({
    components: {
      TooltipButton
    }
  })
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
