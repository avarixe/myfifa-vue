<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-book"
    title="Record Booking"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <template #form>
      <v-container>
        <v-row>
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
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { MinuteField, PlayerSelect } from '@/helpers'

  const mix = mixins(DialogFormable, TeamAccessible, MatchAccessible)

  @Component({
    components: {
      MinuteField,
      PlayerSelect
    }
  })
  export default class BookingForm extends mix {
    booking = {
      player_id: null,
      red_card: false
    }

    async submit () {
      await this.$store.dispatch('bookings/CREATE', {
        matchId: this.match.id,
        booking: {
          ...this.booking,
          minute: this.minute
        }
      })
    }
  }
</script>
