<template>
  <dialog-form
    v-model="dialog"
    title="New Stage"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-btn
          class="my-1"
          dark
          color="teal"
          v-on="on"
        >
          Add Stage
        </v-btn>
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="stage.name"
          label="Name"
          prepend-icon="mdi-table"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-radio-group
          v-model="stage.table"
          row
          hide-details
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
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="stage.num_teams"
          label="Number of Teams"
          prepend-icon="mdi-account-group"
          :rules="rulesFor.num_teams"
          inputmode="numeric"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-col
          v-if="!stage.table"
          cols="12"
        >
          <v-text-field
            v-model="stage.num_fixtures"
            label="Number of Fixtures"
            prepend-icon="mdi-sword-cross"
            :rules="rulesFor.num_fixtures"
            inputmode="numeric"
          />
        </v-col>
      </v-scroll-y-transition>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { DialogFormable } from '@/mixins'
  import { isRequired, isNumber } from '@/functions'

  export default {
    name: 'StageForm',
    mixins: [
      DialogFormable
    ],
    props: {
      competition: { type: Object, required: true }
    },
    data: () => ({
      valid: false,
      stage: {
        name: '',
        num_teams: null,
        num_fixtures: null,
        table: false
      },
      rulesFor: {
        name: [isRequired('Name')],
        num_teams: [
          isRequired('Number of Teams'),
          isNumber('Number of Teams')
        ],
        num_fixtures: [
          isRequired('Number of Fixtures'),
          isNumber('Number of Fixtures')
        ]
      }
    }),
    watch: {
      'stage.table' (val) {
        if (val) {
          this.stage.num_fixtures = null
        }
      }
    },
    methods: {
      ...mapActions('stages', {
        createStage: 'CREATE'
      }),
      async submit () {
        await this.createStage({
          competitionId: this.competition.id,
          stage: this.stage
        })
      }
    }
  }
</script>
