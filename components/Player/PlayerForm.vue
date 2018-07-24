<template>
  <div class="d-inline-block" @click.stop="inForm = true">
    <slot></slot>
    <v-dialog
      v-model="inForm"
      persistent
      lazy
      max-width="500px">
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
                    :rules="$_validate('Name', ['required'])"
                    label="Name"
                    prepend-icon="person"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    v-model="player.pos"
                    :rules="$_validate('Position', ['required'])"
                    :items="positions"
                    label="Position"
                    prepend-icon="directions_run"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    v-model="player.sec_pos"
                    :items="positions"
                    label="Secondary Position(s)"
                    prepend-icon="directions_walk"
                    multiple
                    chips
                    deletable-chips
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="player.birth_year"
                    label="Birth Year"
                    prepend-icon="date_range"
                    mask="####"
                    :rules="$_validate('Birth Year', ['required'])"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    v-model="player.ovr"
                    :items="Array.from({ length: 61 }, (v, k) => k + 40)"
                    :rules="$_validate('OVR', ['required'])"
                    label="OVR"
                    prepend-icon="trending_up"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="player.value"
                    :rules="$_validate('Value', ['required'])"
                    type="number"
                    label="Value"
                    :prefix="team.currency"
                    :hint="$_numberHint(player.value)"
                    persistent-hint
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-checkbox
                    label="Youth Player"
                    v-model="player.youth"
                    :disabled="player.id > 0"
                    hide-details
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
              flat
              large
              @click="inForm = false"
            >Cancel</v-btn>
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
  import FormBase from '@/mixins/FormBase'
  import TeamAction from '@/mixins/TeamAction'

  export default {
    mixins: [ FormBase, TeamAction ],
    props: {
      initialPlayer: {
        type: Object
      }
    },
    data () {
      return {
        valid: !!this.initialPlayer,
        player: Object.assign({
          id: '',
          name: '',
          pos: '',
          sec_pos: [],
          ovr: null,
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
      title () {
        return this.player.id ? 'Edit ' + this.player.name : 'New Player'
      }
    },
    methods: {
      ...mapActions('player', [
        'create',
        'update'
      ]),
      async submit () {
        if (this.$refs.form.validate()) {
          let params, save
          if (this.initialPlayer) {
            params = this.player
            save = this.update
          } else {
            params = { teamId: this.team.id, player: this.player }
            save = this.create
          }

          try {
            await save(params)
            this.inForm = false
          } catch (e) {
            this.errorMessage = e.message
          }
        }
      }
    }
  }
</script>
