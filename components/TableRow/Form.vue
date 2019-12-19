<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="title"
          icon="mdi-table-row-plus-after"
          :on="on"
        />
      </slot>
    </template>

    <template #form>
      <dynamic-fields
        :object="row"
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

  const tableRows = namespace('tableRows')

  @Component({
    components: {
      DynamicFields,
      TooltipButton
    }
  })
  export default class TableRowForm extends mixins(DialogFormable) {
    @tableRows.Action('CREATE') createRow
    @tableRows.Action('UPDATE') updateRow
    @Prop({ type: Object, required: true }) stage
    @Prop(Object) record

    row = {
      name: '',
      wins: null,
      draws: null,
      losses: null,
      goals_for: null,
      goals_against: null
    }

    get fields () {
      return [
        {
          type: 'string',
          attribute: 'name',
          label: 'Team',
          prependIcon: 'mdi-shield-half-full',
          hideDetails: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          cols: 4,
          type: 'string',
          attribute: 'wins',
          prependIcon: 'mdi-alpha-w',
          inputmode: 'numeric',
          hideDetails: true
        },
        {
          cols: 4,
          type: 'string',
          attribute: 'draws',
          prependIcon: 'mdi-alpha-d',
          inputmode: 'numeric',
          hideDetails: true
        },
        {
          cols: 4,
          type: 'string',
          attribute: 'losses',
          prependIcon: 'mdi-alpha-l',
          inputmode: 'numeric',
          hideDetails: true
        },
        {
          cols: 6,
          type: 'string',
          attribute: 'goals_for',
          label: 'GF',
          prependIcon: 'mdi-soccer',
          inputmode: 'numeric',
          hideDetails: true
        },
        {
          cols: 6,
          type: 'string',
          attribute: 'goals_against',
          label: 'GA',
          prependIcon: 'mdi-soccer',
          inputmode: 'numeric',
          hideDetails: true
        }
      ]
    }

    get title () {
      return `${this.record ? 'Edit' : 'Add'} Table Row`
    }

    @Watch('dialog')
    setTableRow (val) {
      if (val && this.record) {
        this.row = pick(this.record, [
          'id',
          'name',
          'wins',
          'draws',
          'losses',
          'goals_for',
          'goals_against'
        ])
      }
    }

    async submit () {
      if (this.record) {
        await this.updateRow(this.row)
      } else {
        await this.createRow({
          stageId: this.stage.id,
          tableRow: this.row
        })
      }
    }
  }
</script>
