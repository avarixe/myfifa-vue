<template>
  <dialog-form
    v-model="dialog"
    title-icon="camera"
    title="Record Booking"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-radio-group v-model="booking.red_card" row hide-details>
            <v-radio
              label="Yellow Card"
              :value="false"
              color="orange darken-2"
            ></v-radio>
            <v-radio
              label="Red Card"
              :value="true"
              color="red darken-2"
            ></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="booking.minute"
            :items="minutes"
            :rules="$_validate('Minute', ['required'])"
            label="Minute"
            prepend-icon="timer"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="booking.player_id"
            :rules="$_validate('Player', ['required'])"
            :items="match.performances"
            item-value="player_id"
            item-text="name"
            label="Player"
            prepend-icon="person">
            <template slot="item" slot-scope="data">
              <v-list-tile-action>
                <v-list-tile-action-text>{{ data.item.pos }}</v-list-tile-action-text>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ data.item.name }}</v-list-tile-title>
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
          minute: null,
          player_id: null,
          red_card: false
        }
      }
    },
    methods: {
      async submit () {
        await this.$store.dispatch('booking/create', {
          matchId: this.match.id,
          booking: this.booking
        })
      }
    }
  }
</script>
