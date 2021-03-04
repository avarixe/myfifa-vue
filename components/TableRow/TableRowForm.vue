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
          :rules="rulesFor.wins"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="row.draws"
          prepend-icon="mdi-alpha-d"
          :rules="rulesFor.draws"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="row.losses"
          prepend-icon="mdi-alpha-l"
          :rules="rulesFor.losses"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="row.goals_for"
          label="GF"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.goals_for"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="row.goals_against"
          label="GA"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.goals_against"
          hide-details
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'
  import { formatRule } from '@/functions/rules'

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
      },
      rulesFor: {
        wins: [formatRule({ type: 'number' })],
        draws: [formatRule({ type: 'number' })],
        losses: [formatRule({ type: 'number' })],
        goals_for: [formatRule({ type: 'number' })],
        goals_against: [formatRule({ type: 'number' })]
      }
    }),
    computed: {
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
