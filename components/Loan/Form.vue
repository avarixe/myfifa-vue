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
              icon
              v-on="{ ...on, ...tooltip }"
            >
              <v-icon color="indigo">mdi-transit-transfer</v-icon>
            </v-btn>
          </template>
          {{ title }}
        </v-tooltip>
      </slot>
    </template>
    <template #form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-date-field
              v-model="loan.started_on"
              label="Start Date"
              prepend-icon="mdi-calendar-today"
              :min="team.currently_on"
              color="indigo"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="loan.origin"
              :rules="$_validate('Origin', ['required'])"
              label="Origin"
              prepend-icon="mdi-airplane-takeoff"
              :disabled="loanOut"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="loan.destination"
              :rules="$_validate('Destination', ['required'])"
              label="Destination"
              prepend-icon="mdi-airplane-landing"
              :disabled="!loanOut"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-col>
          <v-scroll-y-transition mode="out-in">
            <v-col
              v-if="playerLoaned"
              cols="12"
            >
              <v-checkbox
                v-model="loan.returned"
                label="Player Returned"
              />
            </v-col>
          </v-scroll-y-transition>
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { Loan } from '@/models'
  import { VDateField } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)

  @Component({
    components: {
      VDateField
    },
    methods: mapActions('loans', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class LoanForm extends mix {
    @Prop({ type: Object, required: true }) player
    @Prop(String) color
    @Prop(Boolean) dark
    @Prop(Function) submitCb

    loan = {
      destination: '',
      returned: false
    }

    get loanOut () {
      return this.player.status && this.player.status.length > 0
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
    setLoan (val) {
      if (val) {
        if (this.currentLoan) {
          const { id, destination } = this.currentLoan
          Object.assign(this.loan, { id, destination })
        }
        this.loan.started_on = this.team.currently_on
        if (this.loanOut) {
          this.loan.origin = this.team.title
        } else {
          this.loan.destination = this.team.title
        }
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
