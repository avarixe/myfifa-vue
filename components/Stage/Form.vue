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
          dark
          color="teal"
          class="my-1"
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
          :rules="$_validate('Name', ['required'])"
          label="Name"
          prepend-icon="mdi-table"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="stage.num_teams"
          :rules="$_validate('Number of Teams', ['required'])"
          label="Number of Teams"
          prepend-icon="mdi-account-group"
          type="number"
        />
      </v-col>
      <v-col cols="12">
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
      </v-col>
      <v-col cols="12">
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
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)
  const stages = namespace('stages')

  @Component
  export default class StageFrom extends mix {
    @stages.Action('CREATE') createStage
    @Prop({ type: Object, required: true }) competition

    valid = false
    stage = {
      name: '',
      num_teams: null,
      num_fixtures: null,
      table: false
    }

    @Watch('stage.table')
    setNumFixtures (val) {
      if (val) {
        this.stage.num_fixtures = null
      }
    }

    async submit () {
      await this.createStage({
        competitionId: this.competition.id,
        stage: this.stage
      })
    }
  }
</script>
