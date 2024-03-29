<template>
  <dialog-form
    v-model="dialog"
    :title="`Transfer ${player.name}`"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      >
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
          v-model="attributes.signedOn"
          label="Signed Date"
          prepend-icon="mdi-calendar-edit"
          :prefill="team.currentlyOn"
          clearable
        />
      </v-col>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.movedOn"
          label="Effective Date"
          prepend-icon="mdi-calendar-today"
          :min="attributes.signedOn"
          :prefill="team.currentlyOn"
          required
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.origin"
          label="Origin"
          prepend-icon="mdi-airplane-takeoff"
          :rules="rulesFor.origin"
          :disabled="transferOut"
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.destination"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
          :rules="rulesFor.destination"
          :disabled="!transferOut"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.fee"
          label="Fee"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.addonClause"
          label="Add-On Clause (%)"
          :rules="rulesFor.addonClause"
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
      attributes: {
        signedOn: null,
        movedOn: null,
        origin: '',
        destination: '',
        fee: null,
        addonClause: 0
      },
      rulesFor: {
        origin: [isRequired('Origin')],
        destination: [isRequired('Destination')],
        addonClause: [
          isNumber('Add-On Clause'),
          inRange('Add-On Clause', [0, 25])
        ]
      }
    }),
    computed: {
      transferOut () {
        return this.record
          ? this.team.name === this.record.origin
          : this.player.status && this.player.status.length > 0
      },
      transferColor () {
        return this.transferOut ? 'red' : 'green'
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (this.record) {
            this.attributes = pick(this.record, [
              'signedOn',
              'movedOn',
              'origin',
              'destination',
              'fee',
              'addonClause'
            ])
          } else {
            this.attributes.movedOn = this.team.currentlyOn
            if (this.transferOut) {
              this.attributes.origin = this.team.name
            } else {
              this.attributes.destination = this.team.name
            }
          }
        }
      },
      'attributes.addonClause' (addonClause) {
        if (!addonClause) {
          this.attributes.addonClause = 0
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
          await this.updateTransfer({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          await this.createTransfer({
            playerId: this.player.id,
            attributes: this.attributes
          })
        }
      }
    }
  }
</script>
