<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="transferColor"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="`Transfer ${transferOut ? 'Out' : 'In'}`"
          :icon="`mdi-airplane-${transferOut ? 'takeoff' : 'landing'}`"
          :color="transferColor"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-date-field
          v-model="transfer.moved_on"
          label="Effective Date"
          prepend-icon="mdi-calendar-today"
          :min="record ? null : team.currently_on"
          :color="transferColor"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="transfer.origin"
          label="Origin"
          prepend-icon="mdi-airplane-takeoff"
          :rules="rulesFor.origin"
          :disabled="transferOut"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="transfer.destination"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
          :rules="rulesFor.destination"
          :disabled="!transferOut"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model="transfer.fee"
          label="Fee"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="transfer.addon_clause"
          label="Add-On Clause (%)"
          :rules="rulesFor.addon_clause"
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable } from '@/mixins'
  import { isRequired, isNumber, inRange } from '@/functions'

  export default {
    name: 'TransferForm',
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      record: { type: Object, default: null },
      dark: { type: Boolean, default: null }
    },
    data: () => ({
      transfer: {
        moved_on: null,
        origin: '',
        destination: '',
        fee: null,
        addon_clause: 0
      },
      rulesFor: {
        origin: [isRequired('Origin')],
        destination: [isRequired('Destination')],
        addon_clause: [
          isNumber('Add-On Clause'),
          inRange('Add-On Clause', [0, 25])
        ]
      }
    }),
    computed: {
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
        createTransfer: 'create',
        updateTransfer: 'update'
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
