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
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'

  export default {
    name: 'TableRowForm',
    mixins: [
      DialogFormable
    ],
    props: {
      stage: { type: Object, required: true },
      record: { type: Object, default: null }
    },
    data: () => ({
      row: {
        name: '',
        wins: null,
        draws: null,
        losses: null,
        goals_for: null,
        goals_against: null
      }
    }),
    computed: {
      fields () {
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
      },
      title () {
        return `${this.record ? 'Edit' : 'Add'} Table Row`
      }
    },
    watch: {
      dialog (val) {
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
    },
    methods: {
      ...mapActions('tableRows', {
        createRow: 'CREATE',
        updateRow: 'UPDATE'
      }),
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
  }
</script>
