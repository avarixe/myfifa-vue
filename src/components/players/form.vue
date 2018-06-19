<template>
  <div class="d-inline-block" @click="open">
    <slot></slot>
    <v-dialog
      v-model="inForm"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable>
      <v-form v-model="valid" @submit.prevent="id ? updatePlayer() : createPlayer()">
        <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click.native="close">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
          </v-toolbar>
          <v-alert
            type="error"
            v-model="formError"
            dismissible>
            {{ errorMessage }}
          </v-alert>
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
                  <v-select
                    v-model="player.pos"
                    :items="positions"
                    label="Position"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    v-model="player.sec_pos"
                    :items="positions"
                    label="Secondary Position(s)"
                    multiple
                    chips
                    deletable-chips
                    autocomplete
                  ></v-select>
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
                    label="Value"
                    prefix="$"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="!valid" flat large>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // import { format } from 'date-fns'

  export default {
    props: [
      'id',
      'teamId',
      'title'
    ],
    data () {
      return {
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
          age: 16
        },
        menu: false
      }
    },
    computed: {
      ...mapState('player', [
        'positions'
      ]),
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
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
          age: 16
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
  .dialg--fullscreen > form > .card {
    min-height: 100%;
    min-width: 100%;
    margin: 0 !important;
    padding: 0 !important;
  }
</style>