<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...on, ...tooltip }"
              icon
            >
              <v-icon>mdi-table-row-plus-after</v-icon>
            </v-btn>
          </template>
          {{ title }}
        </v-tooltip>
      </slot>
    </template>

    <template #form>
      <v-container grid-list-xs>
        <v-layout wrap>
          <v-flex xs12>
            <v-combobox
              v-model="row.name"
              label="Team"
              :items="competitionTeams"
              prepend-icon="mdi-shield-half-full"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-flex>
          <v-flex xs4>
            <v-text-field
              v-model="row.wins"
              prepend-icon="mdi-alpha-w"
              type="number"
            />
          </v-flex>
          <v-flex xs4>
            <v-text-field
              v-model="row.draws"
              prepend-icon="mdi-alpha-d"
              type="number"
            />
          </v-flex>
          <v-flex xs4>
            <v-text-field
              v-model="row.losses"
              prepend-icon="mdi-alpha-l"
              type="number"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="row.goals_for"
              label="GF"
              prepend-icon="mdi-soccer"
              type="number"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="row.goals_against"
              label="GA"
              prepend-icon="mdi-soccer"
              type="number"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { CompetitionAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, CompetitionAccessible)

  @Component({
    methods: mapActions('tableRows', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class TableRowForm extends mix {
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
        Object.assign(this.row, this.$_pick(this.rowData, [
          'id',
          'name',
          'wins',
          'draws',
          'losses',
          'goals_for',
          'goals_against'
        ]))
      }
    }

    async submit () {
      if (this.rowData) {
        await this.update(this.row)
      } else {
        await this.create({
          stageId: this.stage.id,
          tableRow: this.row
        })
      }
    }
  }
</script>
