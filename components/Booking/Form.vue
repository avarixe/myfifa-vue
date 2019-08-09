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
        <minute-field
          v-model="minute"
          :extra-time="match.extra_time"
        />
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
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { MinuteField, PlayerSelect, TooltipButton } from '@/helpers'

  const mix = mixins(DialogFormable, TeamAccessible, MatchAccessible)

  @Component({
    components: {
      MinuteField,
      PlayerSelect,
      TooltipButton
    },
    methods: mapActions('bookings', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class BookingForm extends mix {
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
        Object.assign(this.booking, this.$_pick(this.record, [
          'id',
          'player_id',
          'red_card'
        ]))
        this.minute = this.record.minute
      }
    }

    async submit () {
      const booking = {
        ...this.booking,
        minute: this.minute
      }

      if (this.record) {
        await this.update(booking)
      } else {
        await this.create({
          matchId: this.match.id,
          booking
        })
      }
    }
  }
</script>
