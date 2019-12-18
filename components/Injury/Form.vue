<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    color="pink"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="title"
          icon="mdi-ambulance"
          color="pink"
          :on="on"
        />
      </slot>
    </template>

    <template #form>
      <dynamic-fields
        :object="injury"
        :fields="fields"
      />
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'
  import { DynamicFields, TooltipButton } from '@/helpers'

  const injuries = namespace('injuries')

  @Component({
    components: {
      DynamicFields,
      TooltipButton
    }
  })
  export default class InjuryForm extends mixins(DialogFormable) {
    @injuries.Action('CREATE') createInjury
    @injuries.Action('UPDATE') updateInjury
    @Prop({ type: Object, required: true }) player
    @Prop(Object) record
    @Prop(String) color
    @Prop(Boolean) dark
    @Prop(Function) submitCb

    injury = {
      description: '',
      recovered: false
    }

    get fields () {
      let fields = []

      if (this.record && this.record.ended_on) {
        fields = [
          {
            type: 'date',
            attribute: 'started_on',
            label: 'Injury Date',
            prependIcon: 'mdi-calendar-today',
            color: 'pink',
            max: this.contract && this.contract.ended_on,
            required: true
          },
          {
            type: 'date',
            attribute: 'ended_on',
            label: 'Recovery Date',
            prependIcon: 'mdi-calendar',
            color: 'pink',
            min: this.contract && this.contract.started_on,
            required: true
          }
        ]
      }

      return [
        ...fields,
        {
          type: 'string',
          attribute: 'description',
          label: 'Description',
          prependIcon: 'mdi-ambulance',
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          type: 'checkbox',
          attribute: 'recovered',
          label: 'Player Recovered',
          hidden: !this.record || this.record.ended_on
        }
      ]
    }

    get title () {
      return this.record
        ? 'Update Injury'
        : 'Record New Injury'
    }

    @Watch('dialog')
    async setInjury (val) {
      if (val && this.record) {
        this.injury = pick(this.record, [
          'id',
          'started_on',
          'ended_on',
          'description'
        ])
      }
    }

    async submit () {
      if (this.record) {
        await this.updateInjury(this.injury)
      } else {
        await this.createInjury({
          playerId: this.player.id,
          injury: this.injury
        })
      }
    }
  }
</script>
