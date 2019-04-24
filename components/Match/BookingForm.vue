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

    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
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
        </v-flex>
        <v-flex xs12>
          <minute-field
            v-model="minute"
            :extra-time="match.extra_time"
          />
        </v-flex>
        <v-flex xs12>
          <player-select
            v-model="booking.player_id"
            :players="unsubbedPlayers"
            required
          />
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import {
    MinuteField,
    PlayerSelect
  } from '@/helpers'
  import {
    TeamAccessible,
    DialogFormable,
    MatchAccessible
  } from '@/mixins'

  export default {
    components: {
      MinuteField,
      PlayerSelect
    },
    mixins: [
      DialogFormable,
      TeamAccessible,
      MatchAccessible
    ],
    data () {
      return {
        booking: {
          player_id: null,
          red_card: false
        }
      }
    },
    methods: {
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
  }
</script>
