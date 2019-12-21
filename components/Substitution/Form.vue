<template lang="pug">
  dialog-form(
    v-model="dialog"
    title-icon="mdi-repeat"
    :title="title"
    :submit="submit"
    :color="color"
  )
    template(#activator="{ on }")
      slot(:on="on")
        tooltip-button(
          label="Substitution"
          icon="mdi-repeat"
          color="green"
          :on="on"
        )
    template(#form)
      dynamic-fields(:fields="fields")
        template(#field.minute)
          minute-field(v-model="minute")
        template(#field.player_id)
          player-select(
            v-model="substitution.player_id"
            :players="unsubbedPlayers"
            icon="mdi-subdirectory-arrow-left"
            required
          )
        template(#field.replacement_id)
          player-select(
            v-model="substitution.replacement_id"
            :players="availablePlayers"
            item-value="id"
            label="Replaced By"
            icon="mdi-subdirectory-arrow-right"
            required
          )
        template(#field.injury)
          v-checkbox(
            v-model="substitution.injury"
            label="Injury"
            hide-details
          )
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { activePlayers } from '@/models/Player'
  import {
    DynamicFields,
    MinuteField,
    PlayerSelect,
    TooltipButton
  } from '@/helpers'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  const mix = mixins(DialogFormable, MatchAccessible, TeamAccessible)
  const substitutions = namespace('substitutions')

  @Component({
    components: {
      DynamicFields,
      MinuteField,
      PlayerSelect,
      TooltipButton
    }
  })
  export default class SubstitutionForm extends mix {
    @substitutions.Action('CREATE') createSubstitution
    @substitutions.Action('UPDATE') updateSubstitution
    @Prop(Object) record

    substitution = {
      player_id: null,
      replacement_id: '',
      injury: false
    }

    get fields () {
      return [
        { slot: 'minute' },
        { slot: 'player_id' },
        { slot: 'replacement_id' },
        { slot: 'injury' }
      ]
    }

    get title () {
      return `${this.record ? 'Edit' : 'Record'} Substitution`
    }

    get availablePlayers () {
      const selectedIds = this.sortedCaps.map(cap => cap.player_id)
      return activePlayers(this.team.id)
        .filter(player => {
          if (selectedIds.indexOf(player.id) < 0) {
            return true
          } else if (this.record) {
            return player.id === this.record.replacement_id
          }
        })
    }

    get unsubbedPlayers () {
      return this.sortedCaps.filter(cap =>
        (cap.player_id !== this.substitution.replacement_id && !cap.subbed_out) ||
        (this.record && cap.player_id === this.record.player_id)
      )
    }

    @Watch('dialog')
    setSubstitution (val) {
      if (val && this.record) {
        this.substitution = pick(this.record, [
          'id',
          'player_id',
          'replacement_id',
          'injury'
        ])
        this.minute = this.record.minute
      }
    }

    async submit () {
      const substitution = {
        ...this.substitution,
        minute: this.minute
      }

      if (this.record) {
        await this.updateSubstitution(substitution)
      } else {
        await this.createSubstitution({
          matchId: this.match.id,
          substitution
        })
      }
    }
  }
</script>
