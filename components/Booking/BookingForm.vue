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
          v-model="booking.home"
          row
          hide-details
          @change="clearNames"
        >
          <v-radio
            :label="match.home"
            :value="true"
            color="teal"
          />
          <v-radio
            :label="match.away"
            :value="false"
            color="pink"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <minute-field v-model="minute" />
      </v-col>
      <v-col cols="12">
        <player-select
          v-if="!booking.home ^ match.home === team.name"
          v-model="booking.playerId"
          :players="unsubbedPlayers"
          required
        />
        <v-text-field
          v-else
          v-model="booking.playerName"
          label="Player"
          prepend-icon="mdi-account"
          :rules="rulesFor.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-radio-group
          v-model="booking.redCard"
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
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { isRequired } from '@/functions'

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
        playerId: null,
        playerName: '',
        redCard: false
      },
      rulesFor: {
        playerName: [isRequired('Player')]
      }
    }),
    computed: {
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
            'playerId',
            'playerName',
            'redCard'
          ])
          this.minute = this.record.minute
        }
      }
    },
    methods: {
      ...mapActions('bookings', {
        createBooking: 'create',
        updateBooking: 'update'
      }),
      clearNames () {
        this.booking.playerId = null
        this.booking.playerName = null
      },
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
