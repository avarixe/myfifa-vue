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
            :items="Array.from({ length: 120 }, (v, k) => k + 1)"
            :rules="$_validate('Minute', ['required'])"
            label="Minute"
            prepend-icon="timer"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="booking.player_id"
            :rules="$_validate('Player', ['required'])"
            :items="match.match_logs"
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
  import { mapState, mapActions } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [
      FormBase,
      TeamAction
    ],
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        booking: {
          minute: null,
          player_id: null,
          player_name: '',
          red_card: false
        }
      }
    },
    computed: mapState('player', {
      players: 'list'
    }),
    watch: {
      'booking.player_id': function (val) {
        this.booking.player_name = val
          ? this.players[val].name
          : ''
      }
    },
    methods: {
      ...mapActions('booking', [
        'create'
      ]),
      submit () {
        this.create({
          matchId: this.match.id,
          booking: this.booking
        })
      }
    }
  }
</script>
