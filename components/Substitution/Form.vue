<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-repeat"
    title="Record Substitution"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Substitution"
          icon="mdi-repeat"
          color="green"
          :on="on"
        />
      </slot>
    </template>

    <template #form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <minute-field
              v-model="minute"
              :extra-time="match.extra_time"
            />
          </v-col>
          <v-col cols="12">
            <player-select
              v-model="substitution.player_id"
              :players="unsubbedPlayers"
              icon="mdi-subdirectory-arrow-left"
              required
            />
          </v-col>
          <v-col cols="12">
            <player-select
              v-model="substitution.replacement_id"
              :players="availablePlayers"
              item-value="id"
              label="Replaced By"
              icon="mdi-subdirectory-arrow-right"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-checkbox
              v-model="substitution.injury"
              label="Injury"
              hide-details
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { activePlayers } from '@/models/Player'
  import { MinuteField, PlayerSelect, TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  const mix = mixins(DialogFormable, MatchAccessible, TeamAccessible)

  @Component({
    components: {
      MinuteField,
      PlayerSelect,
      TooltipButton
    }
  })
  export default class SubstitutionForm extends mix {
    substitution = {
      player_id: null,
      replacement_id: '',
      injury: false
    }

    get availablePlayers () {
      const selectedIds = this.sortedCaps.map(c => c.player_id)
      return activePlayers(this.team.id)
        .filter(p => selectedIds.indexOf(p.id) < 0)
    }

    get unsubbedPlayers () {
      return this.sortedCaps.filter(c => !c.subbed_out)
    }

    async submit () {
      await this.$store.dispatch('substitutions/CREATE', {
        matchId: this.match.id,
        substitution: {
          ...this.substitution,
          minute: this.minute
        }
      })
    }
  }
</script>
