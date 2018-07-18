<template>
  <div class="d-inline-block" @click="inForm = true">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
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
                    :rules="$validate('Name', ['required'])"
                    label="Name"
                    prepend-inner-icon="person"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="player.pos"
                    :rules="$validate('Position', ['required'])"
                    :items="positions"
                    label="Position"
                    prepend-inner-icon="directions_run"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="player.sec_pos"
                    :items="positions"
                    label="Secondary Position(s)"
                    prepend-inner-icon="directions_walk"
                    multiple
                    chips
                    deletable-chips
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="player.birth_year"
                    label="Birth Year"
                    prepend-inner-icon="date_range"
                    mask="####"
                    :rules="$validate('Birth Year', ['required'])"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-slider
                    v-model="player.ovr"
                    label="OVR"
                    min="40"
                    thumb-label="always"
                    ticks
                    always-dirty
                  ></v-slider>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="player.value"
                    :rules="$validate('Value', ['required'])"
                    type="number"
                    label="Value"
                    :prefix="team.currency"
                    :hint="numberHint(player.value)"
                    persistent-hint
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
  import FormMixin from '@/mixins/Form'

  export default {
    mixins: [ FormMixin ],
    props: [
      'initialPlayer',
      'color'
    ],
    data () {
      return {
        valid: !!this.initialPlayer,
        player: Object.assign({
          id: '',
          name: '',
          pos: '',
          sec_pos: [],
          ovr: 70,
          value: null,
          age: 16,
          youth: false
        }, this.initialPlayer)
      }
    },
    computed: {
      ...mapState('player', [
        'positions'
      ]),
      ...mapState('team', {
        team: 'active'
      }),
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
        'create',
        'update'
      ]),
      submit () {
        if (this.$refs.form.validate()) {
          let params, save
          if (this.initialPlayer) {
            params = this.player
            save = this.update
          } else {
            params = { teamId: this.team.id, player: this.player }
            save = this.create
          }

          save(params)
            .then((data) => { this.inForm = false })
            .catch((error) => { this.errorMessage = error.message })
        }
      }
    }
  }
</script>
