<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    color="indigo"
  >
    <slot
      slot="activator"
    >
      <v-tooltip
        bottom
        color="indigo"
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon
            color="indigo"
          >mdi-transit-transfer</v-icon>
        </v-btn>
        {{ title }}
      </v-tooltip>
    </slot>
    <v-container
      slot="form"
    >
      <v-layout
        wrap
      >
        <v-flex
          xs12
        >
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
        <v-scroll-y-transition
          mode="out-in"
        >
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
  </dialog-form>
</template>

<script>
  import {
    mapActions
  } from 'vuex'
  import {
    Loan
  } from '@/models'
  import {
    DialogFormable
  } from '@/mixins'

  export default {
    mixins: [ DialogFormable ],
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
        loan: {
          destination: '',
          returned: false
        }
      }
    },
    computed: {
      playerLoaned () {
        return this.player.status && this.player.status === 'Loaned'
      },
      title () {
        return this.playerLoaned
          ? 'Update Loan'
          : 'Record New Loan'
      },
      currentLoan () {
        return Loan
          .query()
          .where('player_id', this.player.id)
          .orderBy('start_date')
          .last()
      }
    },
    watch: {
      async dialog (val) {
        if (val) {
          const { id, destination } = this.currentLoan
          Object.assign(this.loan, { id, destination })
        } else {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        }
      }
    },
    methods: {
      ...mapActions('loans', {
        create: 'CREATE',
        update: 'UPDATE'
      }),
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
  }
</script>
