<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-book"
    title="Record Booking"
    :submit="submit"
    :color="color"
  >
    <slot
      slot="activator"
    />

    <v-container
      slot="form"
    >
      <v-layout
        wrap
      >
        <v-flex
          xs12
        >
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
        <v-flex
          xs12
        >
          <v-select
            v-model="minute"
            :items="minutes"
            :rules="$_validate('Minute', ['required'])"
            label="Minute"
            prepend-icon="mdi-timer"
          />
        </v-flex>
        <v-flex
          xs12
        >
          <v-select
            v-model="booking.player_id"
            :rules="$_validate('Player', ['required'])"
            :items="unsubbedPlayers"
            item-value="player_id"
            item-text="name"
            label="Player"
            prepend-icon="mdi-account"
          >
            <template
              slot="item"
              slot-scope="data"
            >
              <v-list-tile-action>
                <v-list-tile-action-text
                  v-text="data.item.pos"
                />
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title
                  v-text="data.item.name"
                />
              </v-list-tile-content>
            </template>
          </v-select>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'
  import DialogFormable from '@/mixins/DialogFormable'
  import MatchAccessible from '@/mixins/MatchAccessible'

  export default {
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
        await this.$store.dispatch('entities/bookings/CREATE', {
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
