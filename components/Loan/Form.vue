<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    color="indigo"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-tooltip
          bottom
          color="indigo"
        >
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...on, ...tooltip }"
              icon
            >
              <v-icon color="indigo">mdi-transit-transfer</v-icon>
            </v-btn>
          </template>
          {{ title }}
        </v-tooltip>
      </slot>
    </template>
    <template #form>
      <v-container grid-list-xs>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              v-model="loan.destination"
              :rules="$_validate('Destination', ['required'])"
              label="Destination"
              prepend-icon="mdi-transit-transfer"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-flex>
          <v-scroll-y-transition mode="out-in">
            <v-flex
              v-if="playerLoaned"
              xs12
            >
              <v-checkbox
                v-model="loan.returned"
                label="Player Returned"
              />
            </v-flex>
          </v-scroll-y-transition>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { Loan } from '@/models'
  import { DialogFormable } from '@/mixins'

  @Component({
    methods: mapActions('loans', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class LoanForm extends mixins(DialogFormable) {
    @Prop({ type: Object, required: true }) player
    @Prop(String) color
    @Prop(Boolean) dark
    @Prop(Function) submitCb

    loan = {
      destination: '',
      returned: false
    }

    get playerLoaned () {
      return this.player.status && this.player.status === 'Loaned'
    }

    get title () {
      return this.playerLoaned
        ? 'Update Loan'
        : 'Record New Loan'
    }

    get currentLoan () {
      return Loan
        .query()
        .where('player_id', this.player.id)
        .orderBy('started_on')
        .last()
    }

    @Watch('dialog')
    async setLoan (val) {
      if (val) {
        const { id, destination } = this.currentLoan
        Object.assign(this.loan, { id, destination })
      } else {
        Object.assign(this.$data, this.$options.data.apply(this))
        // this.$refs.form.reset()
      }
    }

    async submit () {
      if (this.playerLoaned) {
        await this.update(this.loan)
      } else {
        await this.create({
          playerId: this.player.id,
          loan: this.loan
        })
      }
    }
  }
</script>
