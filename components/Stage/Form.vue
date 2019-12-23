<template lang="pug">
  dialog-form(
    v-model="dialog"
    title="New Stage"
    :submit="submit"
    :color="color"
  )
    template(#activator="{ on }")
      slot(:on="on")
        v-btn.my-1(
          dark
          color="teal"
          v-on="on"
        ) Add Stage
    template(#form)
      dynamic-fields(:object="stage" :fields="fields")
</template>

<script>
  import { mapActions } from 'vuex'
  import { DialogFormable } from '@/mixins'
  import { DynamicFields } from '@/helpers'

  export default {
    name: 'StageForm',
    components: {
      DynamicFields
    },
    mixins: [
      DialogFormable
    ],
    props: {
      competition: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      valid: false,
      stage: {
        name: '',
        num_teams: null,
        num_fixtures: null,
        table: false
      }
    }),
    computed: {
      fields () {
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
    },
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
