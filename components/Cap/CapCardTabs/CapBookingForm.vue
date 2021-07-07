<template>
  <base-form :submit="saveBooking">
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Book Player
        </div>
        <minute-field v-model="minute" />
        <v-radio-group v-model="booking.red_card">
          <v-radio
            label="Yellow Card"
            color="orange darken-2"
            :value="false"
          />
          <v-radio
            label="Red Card"
            color="red darken-2"
            :value="true"
          />
        </v-radio-group>
        <div class="d-flex">
          <v-spacer />
          <v-btn
            type="submit"
            :disabled="!valid"
            primary
            text
            :loading="loading"
          >
            Save
          </v-btn>
        </div>
      </div>
    </template>
  </base-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { TeamAccessible, MatchAccessible } from '@/mixins'

  export default {
    name: 'CapBookingForm',
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    props: {
      cap: { type: Object, required: true }
    },
    data: () => ({
      booking: {
        home: true,
        player_id: null,
        player_name: '',
        red_card: false
      }
    }),
    watch: {
      cap: {
        immediate: true,
        handler (cap) {
          this.booking.player_id = cap.player_id
          this.booking.player_name = cap.name
        }
      },
      'match.home': {
        immediate: true,
        handler (home) {
          this.booking.home = home === this.team.name
        }
      }
    },
    methods: {
      ...mapActions('bookings', {
        createBooking: 'create'
      }),
      async saveBooking () {
        await this.createBooking({
          matchId: this.match.id,
          booking: {
            ...this.booking,
            minute: this.minute
          }
        })
        this.$emit('submitted')
      }
    }
  }
</script>
