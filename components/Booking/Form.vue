<template lang="pug">
  dialog-form(
    v-model="dialog"
    title-icon="mdi-book"
    :title="title"
    :submit="submit"
    :color="color"
  )
    template(#activator="{ on }")
      slot(:on="on")
        tooltip-button(
          label="Booking"
          icon="mdi-book"
          color="red"
          :on="on"
        )
    template(#form)
      dynamic-fields(:fields="fields")
        template(#field.minute)
          minute-field(v-model="minute")
        template(#field.player_id)
          player-select(
            v-model="booking.player_id"
            :players="unsubbedPlayers"
            required
          )
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import {
    DynamicFields,
    MinuteField,
    PlayerSelect,
    TooltipButton
  } from '@/helpers'

  const mix = mixins(DialogFormable, TeamAccessible, MatchAccessible)
  const bookings = namespace('bookings')

  @Component({
    components: {
      DynamicFields,
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

    get fields () {
      return [
        {
          type: 'radio',
          object: this.booking,
          attribute: 'red_card',
          items: [
            { label: 'Yellow Card', value: false, color: 'orange darken-2' },
            { label: 'Red Card', value: true, color: 'red darken-2' }
          ],
          hideDetails: true
        },
        { slot: 'minute' },
        { slot: 'player_id' }
      ]
    }

    get title () {
      return `${this.record ? 'Edit' : 'Record'} Booking`
    }

    @Watch('dialog')
    setBooking (val) {
      if (val && this.record) {
        this.booking = pick(this.record, [
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
