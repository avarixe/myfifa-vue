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
        <v-tooltip
          bottom
          :color="transferColor"
        >
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...on, ...tooltip }"
              icon
            >
              <v-icon :color="transferColor">
                mdi-airplane-{{ transferOut ? 'takeoff' : 'landing' }}
              </v-icon>
            </v-btn>
          </template>
          Transfer {{ transferOut ? 'Out' : 'In' }}
        </v-tooltip>
      </slot>
    </template>

    <template #form>
      <v-container grid-list-xs>
        <v-layout wrap>
          <v-flex xs12>
            <v-date-field
              v-model="transfer.moved_on"
              label="Effective Date"
              prepend-icon="mdi-calendar-today"
              :min="team.currently_on"
              :color="transferColor"
              required
            />
          </v-flex>
          <v-flex xs12>
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
          </v-flex>
          <v-flex xs12>
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
          </v-flex>
          <v-flex xs12>
            <v-money-field
              v-model="transfer.fee"
              label="Fee"
              :prefix="team.currency"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="transfer.addon_clause"
              label="Add-On Clause (%)"
              :rules="$_validate(
                'Add-On Clause',
                [{ type: 'range', options: { min: 0, max: 25 }}])"
              type="number"
              min="0"
              max="25"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { VDateField, VMoneyField } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)

  @Component({
    components: {
      VDateField,
      VMoneyField
    }
  })
  export default class TransferForm extends mix {
    @Prop({ type: Object, required: true }) player
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
      return this.player.status && this.player.status.length > 0
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
        this.transfer.moved_on = this.team.currently_on
        if (this.transferOut) {
          this.transfer.origin = this.team.title
        } else {
          this.transfer.destination = this.team.title
        }
      }
    }

    async submit () {
      await this.$store.dispatch('transfers/CREATE', {
        playerId: this.player.id,
        transfer: this.transfer
      })
    }
  }
</script>
