<template>
  <dialog-form
    v-model="dialog"
    title="New Stage"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <template #form>
      <v-container>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              v-model="stage.name"
              :rules="$_validate('Name', ['required'])"
              label="Name"
              prepend-icon="mdi-table"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="stage.num_teams"
              :rules="$_validate('Number of Teams', ['required'])"
              label="Number of Teams"
              prepend-icon="mdi-account-group"
              type="number"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="stage.num_fixtures"
              :rules="stage.table
                ? []
                : $_validate('Number of Fixtures', ['required'])"
              label="Number of Fixtures"
              prepend-icon="mdi-sword-cross"
              type="number"
              :disabled="stage.table"
            />
          </v-flex>
          <v-flex xs12>
            <v-radio-group
              v-model="stage.table"
              hide-details
              row
            >
              <v-radio
                label="Table"
                :value="true"
              />
              <v-radio
                label="Elimination Round"
                :value="false"
              />
            </v-radio-group>
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import {
    TeamAccessible,
    DialogFormable
  } from '@/mixins'

  export default {
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      competition: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        valid: false,
        stage: {
          name: '',
          num_teams: null,
          num_fixtures: null,
          table: false
        }
      }
    },
    watch: {
      'stage.table' (val) {
        if (val) {
          this.stage.num_fixtures = null
        }
      }
    },
    methods: {
      async submit () {
        await this.$store.dispatch('stages/CREATE', {
          competitionId: this.competition.id,
          stage: this.stage
        })
      }
    }
  }
</script>
