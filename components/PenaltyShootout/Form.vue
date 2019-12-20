<template lang="pug">
  dialog-form(
    v-model="dialog"
    title-icon="mdi-human"
    :title="title"
    :submit="submit"
    :color="color"
  )
    template(#activator="{ on }")
      slot(:on="on")
        tooltip-button(
          label="Penalty Shootout"
          icon="mdi-human"
          color="indigo"
          :on="on"
        )
    template(#form)
      dynamic-fields(:object="penaltyShootout" :fields="fields")
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { DynamicFields, TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  const mix = mixins(TeamAccessible, DialogFormable, MatchAccessible)
  const penaltyShootout = namespace('penaltyShootout')

  @Component({
    components: {
      DynamicFields,
      TooltipButton
    }
  })
  export default class PenaltyShootoutForm extends mix {
    @penaltyShootout.Action('CREATE') create
    @penaltyShootout.Action('UPDATE') update
    @Prop(Object) record

    penaltyShootout = {
      home_score: null,
      away_score: null
    }

    get fields () {
      return [
        {
          cols: 6,
          type: 'string',
          attribute: 'home_score',
          label: 'Home Score',
          prependIcon: 'mdi-soccer',
          required: true,
          inputmode: 'numeric'
        },
        {
          cols: 6,
          type: 'string',
          attribute: 'away_score',
          label: 'Away Score',
          prependIcon: 'mdi-soccer',
          required: true,
          inputmode: 'numeric'
        }
      ]
    }

    get title () {
      return `${this.record ? 'Edit' : 'Record'} Penalty Shootout`
    }

    @Watch('dialog')
    setPenaltyShootout (val) {
      if (val && this.record) {
        this.penaltyShootout = pick(this.record, [
          'id',
          'home_score',
          'away_score'
        ])
      }
    }

    async submit () {
      const save = this.record ? this.update : this.create

      await save({
        matchId: this.match.id,
        penaltyShootout: this.penaltyShootout
      })
    }
  }
</script>
