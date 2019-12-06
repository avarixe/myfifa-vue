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
      <v-col cols="12">
        <v-text-field
          v-model="row.name"
          label="Team"
          prepend-icon="mdi-shield-half-full"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="row.wins"
          prepend-icon="mdi-alpha-w"
          type="number"
          hide-details
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="row.draws"
          prepend-icon="mdi-alpha-d"
          type="number"
          hide-details
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="row.losses"
          prepend-icon="mdi-alpha-l"
          type="number"
          hide-details
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="row.goals_for"
          label="GF"
          prepend-icon="mdi-soccer"
          type="number"
          hide-details
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="row.goals_against"
          label="GA"
          prepend-icon="mdi-soccer"
          type="number"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'
  import { TooltipButton } from '@/helpers'

  const tableRows = namespace('tableRows')

  @Component({
    components: {
      TooltipButton
    }
  })
  export default class TableRowForm extends mixins(DialogFormable) {
    @tableRows.Action('CREATE') createRow
    @tableRows.Action('UPDATE') updateRow
    @Prop({ type: Object, required: true }) stage
    @Prop(Object) rowData

    row = {
      name: '',
      wins: null,
      draws: null,
      losses: null,
      goals_for: null,
      goals_against: null
    }

    get title () {
      return this.rowData ? 'Edit Table Row' : 'Add Table Row'
    }

    @Watch('dialog')
    setTableRow (val) {
      if (val && this.rowData) {
        this.row = pick(this.rowData, [
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
      if (this.rowData) {
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
