<template>
  <div class="d-inline-block" @click.stop="inForm = true">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-card>
          <v-card-title primary-title :class="formColor">
            <div class="headline">
              <v-icon left>camera</v-icon>
              Record Booking
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
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
                  <v-slider
                    v-model="booking.minute"
                    :label="booking.minute.toString() + '\''"
                    min="1"
                    max="120"
                    ticks
                    hide-details
                  ></v-slider>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="booking.player_id"
                    :rules="$_validate('Player', ['required'])"
                    :items="match.match_logs"
                    item-value="player_id"
                    item-text="name"
                    label="Player"
                    prepend-inner-icon="person">
                    <template slot="item" slot-scope="data">
                      <v-list-tile-action>
                        <v-list-tile-action-text>{{ data.item.pos }}</v-list-tile-action-text>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ data.item.name }}</v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </v-autocomplete>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-alert
            type="error"
            v-model="formError"
            dismissible>
            {{ errorMessage }}
          </v-alert>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              type="submit"
              :disabled="!valid"
              :color="buttonColor"
              flat
              large
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [ FormBase, TeamAction ],
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        booking: {
          minute: 1,
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
      async submit () {
        if (this.$refs.form.validate()) {
          try {
            await this.create({
              matchId: this.match.id,
              booking: this.booking
            })
            this.inForm = false
          } catch (e) {
            this.errorMessage = e.message
          }
        }
      }
    }
  }
</script>
