<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-book"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Booking"
          icon="mdi-book"
          color="red"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <dynamic-fields
        :object="booking"
        :fields="fields"
      >
        <template #field.minute>
          <minute-field v-model="minute" />
        </template>
        <template #field.player_id>
          <player-select
            v-model="booking.player_id"
            :players="unsubbedPlayers"
            required
          />
        </template>
      </dynamic-fields>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { BookingFields } from '@/functions/fields'

  export default {
    name: 'BookingForm',
    mixins: [
      DialogFormable,
      TeamAccessible,
      MatchAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      booking: {
        home: true,
        player_id: null,
        player_name: '',
        red_card: false
      }
    }),
    computed: {
      fields () {
        return BookingFields(this)
      },
      title () {
        return `${this.record ? 'Edit' : 'Record'} Booking`
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.booking = pick(this.record, [
            'id',
            'home',
            'player_id',
            'player_name',
            'red_card'
          ])
          this.minute = this.record.minute
        }
      }
    },
    methods: {
      ...mapActions('bookings', {
        createBooking: 'CREATE',
        updateBooking: 'UPDATE'
      }),
      async submit () {
        const booking = {
          ...this.booking,
          minute: this.minute
        }

        if (this.record) {
          await this.updateBooking(booking)
        } else {
          await this.createBooking({
            matchId: this.match.id,
            booking
          })
        }
      }
    }
  }
</script>