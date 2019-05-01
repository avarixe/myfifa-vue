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
      <v-container>
        <v-layout wrap>
          <v-flex xs12>
            <v-menu
              v-model="menus.effective_date"
              ref="menu1"
              :close-on-content-click="false"
              :return-value.sync="contract.effective_date"
              lazy
              transition="scale-transition"
              full-width
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="contract.effective_date"
                  v-on="on"
                  label="Effective Date"
                  prepend-icon="mdi-calendar-today"
                  :rules="$_validate('Effective Date', ['required', 'date'])"
                  readonly
                />
              </template>
              <v-date-picker
                v-model="contract.effective_date"
                ref="picker1"
                landscape
                :min="team.current_date"
                :max="contract.end_date"
                @input="$refs.menu1.save(contract.effective_date)"
              />
            </v-menu>
          </v-flex>

          <v-flex xs12>
            <v-menu
              v-model="menus.end_date"
              ref="menu2"
              :close-on-content-click="false"
              :return-value.sync="contract.end_date"
              lazy
              transition="scale-transition"
              full-width
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="contract.end_date"
                  v-on="on"
                  label="End Date"
                  prepend-icon="mdi-calendar"
                  :rules="$_validate('End Date', ['required', 'date'])"
                  readonly
                />
              </template>
              <v-date-picker
                v-model="contract.end_date"
                ref="picker2"
                landscape
                :min="contract.effective_date"
                :max="maxEndDate"
                @input="$refs.menu2.save(contract.end_date)"
              />
            </v-menu>
          </v-flex>

          <v-flex xs12>
            <v-text-field
              v-model="contract.wage"
              :rules="$_validate('Wage', ['required'])"
              type="number"
              label="Wage"
              :prefix="team.currency"
              :hint="$_numberHint(contract.wage)"
              persistent-hint
            />
          </v-flex>

          <v-flex xs12>
            <v-text-field
              v-model="contract.signing_bonus"
              type="number"
              label="Signing Bonus"
              :prefix="team.currency"
              :hint="$_numberHint(contract.signing_bonus)"
              persistent-hint
            />
          </v-flex>

          <v-flex xs12>
            <v-text-field
              v-model="contract.release_clause"
              type="number"
              label="Release Clause"
              :prefix="team.currency"
              :hint="$_numberHint(contract.release_clause)"
              persistent-hint
            />
          </v-flex>

          <v-flex xs12>
            <v-text-field
              v-model="contract.performance_bonus"
              type="number"
              label="Performance Bonus"
              :prefix="team.currency"
              :hint="$_numberHint(contract.performance_bonus)"
              persistent-hint
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
  import { mapState } from 'vuex'
  import { addYears } from 'date-fns'
  import { Contract } from '@/models'
  import {
    TeamAccessible,
    DialogFormable
  } from '@/mixins'

  export default {
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      player: {
        type: Object,
        required: true
      },
      color: String,
      dark: Boolean,
      submitCb: Function
    },
    data () {
      return {
        valid: false,
        title: 'Sign New Contract',
        contract: {
          effective_date: null,
          end_date: null,
          wage: null,
          signing_bonus: null,
          release_clause: null,
          performance_bonus: null,
          bonus_req: null,
          bonus_req_type: null
        },
        menus: {
          effective_date: false,
          end_date: false
        }
      }
    },
    computed: {
      ...mapState('contracts', [
        'bonusRequirementTypes'
      ]),
      maxEndDate () {
        return this.$_format(
          addYears(this.$_parse(this.contract.effective_date), 6)
        )
      },
      currentContract () {
        return Contract
          .query()
          .where('player_id', this.player.id)
          .where('effective_date', date => date <= this.team.current_date)
          .where('end_date', date => this.team.current_date < date)
          .last()
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          Object.assign(this.contract, {
            ...this.currentContract,
            effective_date: this.team.current_date
          })
        } else {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        }
      },
      'menus.end_date' (val, oldVal) {
        return !oldVal &&
          val &&
          this.$nextTick(() => (this.$refs.picker2.activePicker = 'YEAR'))
      }
    },
    methods: {
      async submit () {
        await this.$store.dispatch('contracts/CREATE', {
          playerId: this.player.id,
          contract: this.contract
        })
      }
    }
  }
</script>
