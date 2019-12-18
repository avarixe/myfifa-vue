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
      <dynamic-fields
        :object="stage"
        :fields="fields"
      />
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import { DialogFormable } from '@/mixins'
  import { DynamicFields } from '@/helpers'

  const stages = namespace('stages')

  @Component({
    components: {
      DynamicFields
    }
  })
  export default class StageFrom extends mixins(DialogFormable) {
    @stages.Action('CREATE') createStage
    @Prop({ type: Object, required: true }) competition

    valid = false
    stage = {
      name: '',
      num_teams: null,
      num_fixtures: null,
      table: false
    }

    get fields () {
      return [
        {
          type: 'string',
          attribute: 'name',
          label: 'Name',
          prependIcon: 'mdi-table',
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          type: 'radio',
          attribute: 'table',
          items: [
            { label: 'Table', value: true },
            { label: 'Elimination Round', value: false }
          ],
          hideDetails: true
        },
        {
          type: 'string',
          attribute: 'num_teams',
          label: 'Number of Teams',
          prependIcon: 'mdi-account-group',
          inputmode: 'numeric',
          required: true
        },
        {
          type: 'string',
          attribute: 'num_fixtures',
          label: 'Number of Fixtures',
          prependIcon: 'mdi-sword-cross',
          inputmode: 'numeric',
          hidden: this.stage.table
        }
      ]
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
