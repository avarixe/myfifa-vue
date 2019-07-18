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
              v-on="{ ...on, ...tooltip }"
              icon
            >
              <v-icon color="blue">mdi-file-document-outline</v-icon>
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
            <v-date-field
              v-model="contract.effective_date"
              label="Effective Date"
              prepend-icon="mdi-calendar-today"
              :min="team.current_date"
              :max="contract.end_date"
              required
            />
          </v-flex>

          <v-flex xs12>
            <v-date-field
              v-model="contract.end_date"
              label="End Date"
              prepend-icon="mdi-calendar"
              :min="contract.effective_date"
              :max="maxEndDate"
              required
              start-with-year
            />
          </v-flex>

          <v-flex xs12>
            <v-money-field
              v-model="contract.wage"
              label="Wage"
              :prefix="team.currency"
              required
            />
          </v-flex>

          <v-flex xs12>
            <v-money-field
              v-model="contract.signing_bonus"
              label="Signing Bonus"
              :prefix="team.currency"
            />
          </v-flex>

          <v-flex xs12>
            <v-money-field
              v-model="contract.release_clause"
              label="Release Clause"
              :prefix="team.currency"
            />
          </v-flex>

          <v-flex xs12>
            <v-money-field
              v-model="contract.performance_bonus"
              label="Performance Bonus"
              :prefix="team.currency"
            />
          </v-flex>

          <v-scroll-y-transition mode="out-in">
            <v-flex
              v-if="contract.performance_bonus"
              xs12
              sm6
            >
              <v-text-field
                v-model="contract.bonus_req"
                label="Bonus Req."
                type="number"
                prefix="if"
              />
            </v-flex>
          </v-scroll-y-transition>

          <v-scroll-y-transition mode="out-in">
            <v-flex
              v-if="contract.performance_bonus"
              xs12
              sm6
            >
              <v-select
                v-model="contract.bonus_req_type"
                label="Bonus Req. Type"
                :items="bonusRequirementTypes"
                clearable
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
      effective_date: null,
      end_date: null,
      wage: null,
      signing_bonus: null,
      release_clause: null,
      performance_bonus: null,
      bonus_req: null,
      bonus_req_type: null
    }

    get maxEndDate () {
      return this.$_format(
        addYears(this.$_parse(this.contract.effective_date), 6)
      )
    }

    get currentContract () {
      return Contract
        .query()
        .where('player_id', this.player.id)
        .where('effective_date', date => date <= this.team.current_date)
        .where('end_date', date => this.team.current_date < date)
        .last()
    }

    @Watch('dialog')
    setContract (val) {
      if (val) {
        Object.assign(this.contract, {
          ...this.currentContract,
          effective_date: this.team.current_date,
          end_date: this.team.current_date
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
