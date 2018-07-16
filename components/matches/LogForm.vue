<template>
  <div class="d-inline-block" @click.stop="inForm = true">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form ref="form" v-model="valid" @submit.prevent="save">
        <v-card>
          <v-card-title primary-title :class="formColor">
            <div class="headline">{{ title }}</div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-layout wrap>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="match_log.pos"
                    :items="positions"
                    :rules="$validate('Position', ['required'])"
                    label="Position"
                    prepend-inner-icon="directions_run"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="match_log.player_id"
                    :items="players"
                    item-text="name"
                    item-value="id"
                    :rules="$validate('Player', ['required'])"
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
  import { mapState, mapGetters, mapActions } from 'vuex'
  import FormMixin from '@/mixins/Form'

  export default {
    mixins: [ FormMixin ],
    props: [
      'initialLog',
      'match',
      'color'
    ],
    data () {
      return {
        valid: !!this.initialLog,
        match_log: Object.assign({
          player_id: null,
          pos: ''
        }, this.initialLog)
      }
    },
    computed: {
      ...mapState('match', [
        'positions'
      ]),
      ...mapGetters('player', {
        players: 'active'
      }),
      title () {
        return this.match_log.id ? 'Edit Position' : 'Add Position'
      },
      buttonColor () {
        return this.color ? this.color + ' darken-2' : null
      },
      formColor () {
        return this.color ? this.color + ' accent-2' : null
      }
    },
    methods: {
      ...mapActions('match', {
        create: 'addLog',
        update: 'updateLog'
      }),
      save () {
        if (this.$refs.form.validate()) {
          let params, save
          if ('id' in this.match_log) {
            params = this.match_log
            save = this.update
          } else {
            params = { matchId: this.match.id, matchLog: this.match_log }
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