<template lang="pug">
  dialog-form(
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    :color="transferColor"
  )
    template(#activator="{ on }")
      slot(:on="on")
        tooltip-button(
          :label="`Transfer ${transferOut ? 'Out' : 'In'}`"
          :icon="`mdi-airplane-${transferOut ? 'takeoff' : 'landing'}`"
          :color="transferColor"
          :on="on"
        )
    template(#form)
      dynamic-fields(:object="transfer" :fields="fields")
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DynamicFields, TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  export default {
    name: 'TransferForm',
    components: {
      DynamicFields,
      TooltipButton
    },
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      player: {
        type: Object,
        required: true
      },
      record: {
        type: Object,
        default: null
      },
      dark: {
        type: Boolean,
        default: null
      }
    },
    data: () => ({
      transfer: {
        moved_on: null,
        origin: '',
        destination: '',
        fee: null,
        addon_clause: 0
      }
    }),
    computed: {
      fields () {
        return [
          {
            type: 'date',
            attribute: 'moved_on',
            label: 'Effective Date',
            prependIcon: 'mdi-calendar-today',
            min: this.record ? null : this.team.currently_on,
            color: this.transferColor,
            required: true
          },
          {
            type: 'string',
            attribute: 'origin',
            label: 'Origin',
            prependIcon: 'mdi-airplane-takeoff',
            required: true,
            disabled: this.transferOut,
            spellcheck: 'false',
            autocapitalize: 'words',
            autocomplete: 'off',
            autocorrect: 'off'
          },
          {
            type: 'string',
            attribute: 'destination',
            label: 'Destination',
            prependIcon: 'mdi-airplane-landing',
            required: true,
            disabled: !this.transferOut,
            spellcheck: 'false',
            autocapitalize: 'words',
            autocomplete: 'off',
            autocorrect: 'off'
          },
          {
            type: 'money',
            attribute: 'fee',
            label: 'Fee',
            prefix: this.team.currency,
            hideDetails: true
          },
          {
            type: 'string',
            attribute: 'addon_clause',
            label: 'Add-On Clause (%)',
            inputmode: 'numeric',
            range: { min: 0, max: 25 }
          }
        ]
      },
      transferOut () {
        return this.record
          ? this.team.title === this.record.origin
          : this.player.status && this.player.status.length > 0
      },
      title () {
        return 'Transfer ' + this.player.name
      },
      transferColor () {
        return this.transferOut ? 'red' : 'green'
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (this.record) {
            this.transfer = pick(this.record, [
              'id',
              'moved_on',
              'origin',
              'destination',
              'fee',
              'addon_clause'
            ])
          } else {
            this.transfer.moved_on = this.team.currently_on
            if (this.transferOut) {
              this.transfer.origin = this.team.title
            } else {
              this.transfer.destination = this.team.title
            }
          }
        }
      }
    },
    methods: {
      ...mapActions('transfers', {
        createTransfer: 'CREATE',
        updateTransfer: 'UPDATE'
      }),
      async submit () {
        if (this.record) {
          await this.updateTransfer(this.transfer)
        } else {
          await this.createTransfer({
            playerId: this.player.id,
            transfer: this.transfer
          })
        }
      }
    }
  }
</script>
