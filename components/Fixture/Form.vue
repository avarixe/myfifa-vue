<template>
  <dialog-form
    v-model="dialog"
    title="Add Fixture"
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
          Add Fixture
        </v-tooltip>
      </slot>
    </template>

    <template #form>
      <v-container grid-list-xs>
        <v-layout wrap>
          <v-flex xs12>
            <v-combobox
              v-model="fixture.home_team"
              label="Home Team"
              :items="competitionTeams"
              prepend-icon="mdi-shield-half-full"
            />
          </v-flex>
          <v-flex xs12>
            <v-combobox
              v-model="fixture.away_team"
              label="Away Team"
              :items="competitionTeams"
              prepend-icon="mdi-shield-half-full"
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="fixture.home_score"
              label="Home Score"
              prepend-icon="mdi-soccer"
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="fixture.away_score"
              label="Away Score"
              prepend-icon="mdi-soccer"
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
      fixture: {
        home_team: '',
        home_score: '',
        away_score: '',
        away_team: ''
      }
    }),
    methods: {
      async submit () {
        await this.$store.dispatch('fixtures/CREATE', {
          stageId: this.stage.id,
          fixture: this.fixture
        })
      }
    }
  }
</script>
