<template>
  <div class="d-inline-block" @click="open">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form v-model="valid" @submit.prevent="id ? updatePlayer() : createPlayer()">
        <v-card>
          <v-card-title primary-title :class="formColor">
            <div class="headline">{{ title }}</div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="player.name"
                    label="Name"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="player.pos"
                    :items="positions"
                    label="Position"
                    required
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="player.sec_pos"
                    :items="positions"
                    label="Secondary Position(s)"
                    multiple
                    chips
                    deletable-chips
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-slider
                    v-model="player.age"
                    :label="player.age.toString()"
                    min="16"
                    max="50"
                    thumb-label
                    ticks
                    hint="Age"
                    persistent-hint
                  ></v-slider>
                </v-flex>
                <v-flex xs12>
                  <v-slider
                    v-model="player.ovr"
                    :label="player.ovr.toString()"
                    min="40"
                    thumb-label
                    ticks
                    hint="OVR"
                    persistent-hint
                  ></v-slider>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="player.value"
                    type="number"
                    label="Value"
                    :prefix="team.currency"
                    :hint="numberHint(player.value)"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-checkbox
                    label="Youth Player"
                    v-model="player.youth"
                    :disabled="player.id > 0"
                  ></v-checkbox>
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
  import formMixin from '@/mixins/form'

  export default {
    mixins: [formMixin],
    props: [
      'id',
      'teamId',
      'color'
    ],
    data: () => ({
      inForm: false,
      valid: false,
      errorMessage: '',
      player: {
        id: '',
        name: '',
        pos: '',
        sec_pos: [],
        ovr: 70,
        value: null,
        age: 16,
        youth: false
      }
    }),
    computed: {
      ...mapState('player', [
        'positions'
      ]),
      ...mapState('team', {
        team: 'active'
      }),
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      },
      title () {
        return this.player.id ? 'Edit ' + this.player.name : 'New Player'
      },
      buttonColor () {
        return this.color ? this.color + ' darken-2' : null
      },
      formColor () {
        return this.color ? this.color + ' accent-2' : null
      }
    },
    methods: {
      ...mapActions('player', [
        'get',
        'create',
        'update'
      ]),
      open () {
        this.inForm = true

        if (this.id) {
          this.get({ playerId: this.id })
            .then((data) => { this.player = data })
            .catch((error) => { this.errorMessage = error.message })
        }
      },
      close () {
        this.inForm = false
        this.errorMessage = ''
        this.player = {
          id: '',
          name: '',
          pos: '',
          sec_pos: [],
          ovr: 70,
          value: null,
          age: 16,
          youth: false
        }
      },
      createPlayer () {
        this.create({
          teamId: this.teamId,
          player: this.player
        }).then((data) => { this.close() })
          .catch((error) => { this.errorMessage = error.message })
      },
      updatePlayer () {
        this.update(this.player)
          .then((data) => { this.close() })
          .catch((error) => { this.errorMessage = error.message })
      }
    }
  }
</script>

<style scoped>
  .dialog > form { min-width: 100%; }
  .dialog--fullscreen > form > .card {
    min-height: 100%;
    min-width: 100%;
    margin: 0 !important;
    padding: 0 !important;
  }
</style>
