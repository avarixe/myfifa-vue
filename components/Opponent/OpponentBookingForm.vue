<template>
  <base-form :submit="saveBooking">
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Book Player
        </div>
        <minute-field v-model="minute" />
        <v-text-field
          v-model="booking.player_name"
          label="Player"
          prepend-icon="mdi-account"
          :rules="rules.player_name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
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
  import { requiredRule } from '@/functions/rules'

  export default {
    name: 'CapBookingForm',
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    data: () => ({
      booking: {
        home: true,
        player_name: '',
        red_card: false
      }
    }),
    computed: {
      rules () {
        return {
          player_name: [requiredRule({ label: 'Player' })]
        }
      }
    },
    watch: {
      'match.home': {
        immediate: true,
        handler (home) {
          this.booking.home = home !== this.team.title
        }
      }
    },
    methods: {
      ...mapActions('bookings', {
        createBooking: 'CREATE'
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
