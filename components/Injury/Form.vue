<template lang="pug">
  dialog-form(
    v-model="dialog"
    :title="title"
    :submit="submit"
    color="pink"
  )
    template(#activator="{ on }")
      slot(:on="on")
        tooltip-button(
          :label="title"
          icon="mdi-ambulance"
          color="pink"
          :on="on"
        )
    template(#form)
      dynamic-fields(:object="injury" :fields="fields")
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'

  export default {
    name: 'InjuryForm',
    mixins: [
      DialogFormable
    ],
    props: {
      player: { type: Object, required: true },
      record: { type: Object, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: false }
    },
    data: () => ({
      injury: {
        description: '',
        recovered: false
      }
    }),
    computed: {
      fields () {
        let fields = []

        if (this.record && this.record.ended_on) {
          fields = [
            {
              type: 'date',
              attribute: 'started_on',
              label: 'Injury Date',
              prependIcon: 'mdi-calendar-today',
              color: 'pink',
              max: this.contract && this.contract.ended_on,
              required: true
            },
            {
              type: 'date',
              attribute: 'ended_on',
              label: 'Recovery Date',
              prependIcon: 'mdi-calendar',
              color: 'pink',
              min: this.contract && this.contract.started_on,
              required: true
            }
          ]
        }

        return [
          ...fields,
          {
            type: 'string',
            attribute: 'description',
            label: 'Description',
            prependIcon: 'mdi-ambulance',
            required: true,
            spellcheck: 'false',
            autocapitalize: 'words',
            autocomplete: 'off',
            autocorrect: 'off'
          },
          {
            type: 'checkbox',
            attribute: 'recovered',
            label: 'Player Recovered',
            hidden: !this.record || this.record.ended_on
          }
        ]
      },
      title () {
        return this.record
          ? 'Update Injury'
          : 'Record New Injury'
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.injury = pick(this.record, [
            'id',
            'started_on',
            'ended_on',
            'description'
          ])
        }
      }
    },
    methods: {
      ...mapActions('injuries', {
        createInjury: 'CREATE',
        updateInjury: 'UPDATE'
      }),
      async submit () {
        if (this.record) {
          await this.updateInjury(this.injury)
        } else {
          await this.createInjury({
            playerId: this.player.id,
            injury: this.injury
          })
        }
      }
    }
  }
</script>
