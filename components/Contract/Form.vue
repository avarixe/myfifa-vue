<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    color="blue"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-tooltip
          bottom
          color="blue"
        >
          <template #activator="{ on: tooltip }">
            <v-btn
              icon
              v-on="{ ...on, ...tooltip }"
            >
              <v-icon color="blue">mdi-file-document-outline</v-icon>
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
              v-model="contract.started_on"
              label="Effective Date"
              prepend-icon="mdi-calendar-today"
              :min="team.currently_on"
              :max="contract.ended_on"
              required
            />
          </v-col>

          <v-col cols="12">
            <v-date-field
              v-model="contract.ended_on"
              label="End Date"
              prepend-icon="mdi-calendar"
              :min="contract.started_on"
              :max="maxEndDate"
              required
              start-with-year
            />
          </v-col>

          <v-col cols="12">
            <v-money-field
              v-model="contract.wage"
              label="Wage"
              :prefix="team.currency"
              required
            />
          </v-col>

          <v-col cols="12">
            <v-money-field
              v-model="contract.signing_bonus"
              label="Signing Bonus"
              :prefix="team.currency"
            />
          </v-col>

          <v-col cols="12">
            <v-money-field
              v-model="contract.release_clause"
              label="Release Clause"
              :prefix="team.currency"
            />
          </v-col>

          <v-col cols="12">
            <v-money-field
              v-model="contract.performance_bonus"
              label="Performance Bonus"
              :prefix="team.currency"
            />
          </v-col>

          <v-scroll-y-transition mode="out-in">
            <v-col
              v-if="contract.performance_bonus"
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="contract.bonus_req"
                label="Bonus Req."
                type="number"
                prefix="if"
              />
            </v-col>
          </v-scroll-y-transition>

          <v-scroll-y-transition mode="out-in">
            <v-col
              v-if="contract.performance_bonus"
              cols="12"
              sm="6"
            >
              <v-select
                v-model="contract.bonus_req_type"
                label="Bonus Req. Type"
                :items="bonusRequirementTypes"
                clearable
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
  import { mapState } from 'vuex'
  import { addYears } from 'date-fns'
  import { Contract } from '@/models'
  import { VDateField, VMoneyField } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)

  @Component({
    components: {
      VDateField,
      VMoneyField
    },
    computed: mapState('contracts', [
      'bonusRequirementTypes'
    ])
  })
  export default class ContractForm extends mix {
    @Prop({ type: Object, required: true }) player
    @Prop(String) color
    @Prop(Boolean) dark
    @Prop(Function) submitCb

    valid = false
    title = 'Sign New Contract'
    contract = {
      started_on: null,
      ended_on: null,
      wage: null,
      signing_bonus: null,
      release_clause: null,
      performance_bonus: null,
      bonus_req: null,
      bonus_req_type: null
    }

    get maxEndDate () {
      return this.$_format(
        addYears(this.$_parse(this.contract.started_on), 6)
      )
    }

    get currentContract () {
      return Contract
        .query()
        .where('player_id', this.player.id)
        .where('started_on', date => date <= this.team.currently_on)
        .where('ended_on', date => this.team.currently_on < date)
        .last()
    }

    @Watch('dialog')
    setContract (val) {
      if (val) {
        Object.assign(this.contract, {
          ...this.currentContract,
          started_on: this.team.currently_on,
          ended_on: this.team.currently_on
        })
      } else {
        Object.assign(this.$data, this.$options.data.apply(this))
        // this.$refs.form.reset()
      }
    }

    async submit () {
      await this.$store.dispatch('contracts/CREATE', {
        playerId: this.player.id,
        contract: this.contract
      })
    }
  }
</script>
