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
      dynamic-fields(:object="booking" :fields="fields")
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
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  export default {
    name: 'BookingForm',
    mixins: [
      DialogFormable,
      TeamAccessible,
      MatchAccessible
    ],
    props: {
      record: {
        type: Object,
        default: null
      }
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
        let fields = [
          {
            type: 'radio',
            attribute: 'home',
            items: [
              { label: this.match.home, value: true, color: 'teal' },
              { label: this.match.away, value: false, color: 'pink' }
            ],
            hideDetails: true,
            onUpdate: this.clearNames
          },
          { slot: 'minute' }
        ]

        if (this.teamBooking) {
          fields.push({ slot: 'player_id' })
        } else {
          fields.push({
            type: 'string',
            attribute: 'player_name',
            label: 'Player',
            prependIcon: 'mdi-account',
            required: true,
            spellcheck: 'false',
            autocapitalize: 'words',
            autocomplete: 'off',
            autocorrect: 'off'
          })
        }

        return [
          ...fields,
          {
            type: 'radio',
            attribute: 'red_card',
            items: [
              { label: 'Yellow Card', value: false, color: 'orange darken-2' },
              { label: 'Red Card', value: true, color: 'red darken-2' }
            ],
            hideDetails: true
          }
        ]
      },
      title () {
        return `${this.record ? 'Edit' : 'Record'} Booking`
      },
      teamBooking () {
        return !this.booking.home ^ this.match.home === this.team.title
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
      clearNames () {
        this.booking.player_id = null
        this.booking.player_name = ''
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
