<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    color="blue">
    <slot slot="activator">
      <v-tooltip bottom color="blue">
        <v-btn slot="activator" icon>
          <v-icon color="blue">mdi-file-document-outline</v-icon>
        </v-btn>
        {{ title }}
      </v-tooltip>
    </slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-menu
            ref="menu1"
            :close-on-content-click="false"
            v-model="menus.effective_date"
            :return-value.sync="contract.effective_date"
            lazy
            transition="scale-transition"
            full-width>
            <v-text-field
              slot="activator"
              label="Effective Date"
              prepend-icon="mdi-calendar-today"
              v-model="contract.effective_date"
              :rules="$_validate('Effective Date', ['required', 'date'])"
              readonly
            ></v-text-field>
            <v-date-picker
              ref="picker1"
              v-model="contract.effective_date"
              landscape
              :min="team.current_date"
              :max="contract.end_date"
              @input="$refs.menu1.save(contract.effective_date)"
            ></v-date-picker>
          </v-menu>
        </v-flex>

        <v-flex xs12>
          <v-menu
            ref="menu2"
            :close-on-content-click="false"
            v-model="menus.end_date"
            :return-value.sync="contract.end_date"
            lazy
            transition="scale-transition"
            full-width>
            <v-text-field
              slot="activator"
              label="End Date"
              prepend-icon="mdi-calendar"
              v-model="contract.end_date"
              :rules="$_validate('End Date', ['required', 'date'])"
              readonly
            ></v-text-field>
            <v-date-picker
              ref="picker2"
              v-model="contract.end_date"
              landscape
              :min="contract.effective_date"
              :max="maxEndDate"
              @input="$refs.menu2.save(contract.end_date)"
            ></v-date-picker>
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
          ></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field
            v-model="contract.signing_bonus"
            type="number"
            label="Signing Bonus"
            :prefix="team.currency"
            :hint="$_numberHint(contract.signing_bonus)"
            persistent-hint
          ></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field
            v-model="contract.release_clause"
            type="number"
            label="Release Clause"
            :prefix="team.currency"
            :hint="$_numberHint(contract.release_clause)"
            persistent-hint
          ></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field
            v-model="contract.performance_bonus"
            type="number"
            label="Performance Bonus"
            :prefix="team.currency"
            :hint="$_numberHint(contract.performance_bonus)"
            persistent-hint
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
            v-model="contract.bonus_req"
            label="Bonus Req."
            type="number"
            prefix="if"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-select
            v-model="contract.bonus_req_type"
            label="Bonus Req. Type"
            :items="bonusRequirementTypes"
            clearable
          ></v-select>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { addYears } from 'date-fns'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import DialogFormable from '@/mixins/DialogFormable'

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
      ...mapState('contract', [
        'bonusRequirementTypes'
      ]),
      title () {
        return ('id' in this.contract) ? 'Update Contract' : 'Sign New Contract'
      },
      maxEndDate () {
        return this.$_format(addYears(this.$_parse(this.contract.effective_date), 6))
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          this.contract = {
            ...this.player.current_contract,
            effective_date: this.team.current_date
          }
        } else {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        }
      },
      'menus.end_date' (val, oldVal) {
        return !oldVal && val && this.$nextTick(() => (this.$refs.picker2.activePicker = 'YEAR'))
      }
    },
    methods: {
      ...mapActions('contract', [
        'create'
      ]),
      async submit () {
        await this.create({
          playerId: this.player.id,
          contract: this.contract
        })
      }
    }
  }
</script>
