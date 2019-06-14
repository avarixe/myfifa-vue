<template>
  <dialog-form
    v-model="dialog"
    title="Add Table Row"
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
          Add Table Row
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
  import { CompetitionAccessible, DialogFormable } from '@/mixins'

  export default {
    mixins: [
      CompetitionAccessible,
      DialogFormable
    ],
    props: {
      stage: {
        type: Object,
        required: true
      }
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
    methods: {
      async submit () {
        await this.$store.dispatch('tableRows/CREATE', {
          stageId: this.stage.id,
          tableRow: this.row
        })
      }
    }
  }
</script>
