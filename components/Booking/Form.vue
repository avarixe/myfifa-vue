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
      <v-col cols="12">
        <v-radio-group
          v-model="booking.red_card"
          row
          hide-details
        >
          <v-radio
            label="Yellow Card"
            :value="false"
            color="orange darken-2"
          />
          <v-radio
            label="Red Card"
            :value="true"
            color="red darken-2"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <minute-field v-model="minute" />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="booking.player_id"
          :players="unsubbedPlayers"
          required
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { MinuteField, PlayerSelect, TooltipButton } from '@/helpers'

  const mix = mixins(DialogFormable, TeamAccessible, MatchAccessible)
  const bookings = namespace('bookings')

  @Component({
    components: {
      MinuteField,
      PlayerSelect,
      TooltipButton
    }
  })
  export default class BookingForm extends mix {
    @bookings.Action('CREATE') createBooking
    @bookings.Action('UPDATE') updateBooking
    @Prop(Object) record

    booking = {
      player_id: null,
      red_card: false
    }

    get title () {
      return `${this.record ? 'Edit' : 'Record'} Booking`
    }

    @Watch('dialog')
    setBooking (val) {
      if (val && this.record) {
        this.booking = this.$_pick(this.record, [
          'id',
          'player_id',
          'red_card'
        ])
        this.minute = this.record.minute
      }
    }

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
</script>
