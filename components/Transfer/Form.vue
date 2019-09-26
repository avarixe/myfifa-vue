<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
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
          :rules="$_validate('Origin', ['required'])"
          label="Origin"
          prepend-icon="mdi-airplane-takeoff"
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
          :rules="$_validate('Destination', ['required'])"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
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
          hide-details
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="transfer.addon_clause"
          label="Add-On Clause (%)"
          :rules="$_validate(
            'Add-On Clause',
            [{ type: 'range', options: { min: 0, max: 25 }}])"
          type="number"
          min="0"
          max="25"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { VDateField, VMoneyField, TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)

  @Component({
    components: {
      VDateField,
      VMoneyField,
      TooltipButton
    },
    methods: mapActions('transfers', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class TransferForm extends mix {
    @Prop({ type: Object, required: true }) player
    @Prop(Object) record
    @Prop(Boolean) dark
    @Prop(Function) submitCb

    transfer = {
      moved_on: null,
      origin: '',
      destination: '',
      fee: null,
      addon_clause: 0
    }

    get transferOut () {
      return this.record
        ? this.team.title === this.record.origin
        : this.player.status && this.player.status.length > 0
    }

    get title () {
      return 'Transfer ' + this.player.name
    }

    get transferColor () {
      return this.transferOut ? 'red' : 'green'
    }

    @Watch('dialog')
    setTransfer (val) {
      if (val) {
        if (this.record) {
          this.transfer = this.$_pick(this.record, [
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

    async submit () {
      if (this.record) {
        await this.update(this.transfer)
      } else {
        await this.create({
          playerId: this.player.id,
          transfer: this.transfer
        })
      }
    }
  }
</script>
