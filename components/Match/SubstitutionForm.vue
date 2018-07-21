<template>
  <div class="d-inline-block" @click.stop="inForm = true">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-card>
          <v-card-title primary-title :class="formColor">
            <div class="headline">
              <v-icon left>repeat</v-icon>
              Record Substitution
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-layout wrap>
                <v-flex xs12>
                  <v-slider
                    v-model="substitution.minute"
                    :label="substitution.minute.toString() + '\''"
                    min="1"
                    max="120"
                    ticks
                    hide-details
                  ></v-slider>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="substitution.player_id"
                    :rules="$_validate('Player', ['required'])"
                    :items="match.match_logs"
                    item-value="player_id"
                    item-text="name"
                    label="Player"
                    prepend-inner-icon="person"
                    @change="setPlayerName">
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
                <v-flex xs12>
                  <v-autocomplete
                    v-model="substitution.replacement_id"
                    :rules="$_validate('Replaced By', ['required'])"
                    :items="availablePlayers"
                    item-value="id"
                    item-text="name"
                    label="Replaced By"
                    prepend-inner-icon="person_outline"
                    @change="setReplacedBy"
                    clearable>
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
                <v-flex xs12>
                  <v-checkbox
                    label="Injury"
                    v-model="substitution.injury"
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
        substitution: {
          minute: 1,
          player_id: null,
          player_name: '',
          replaced_by: '',
          replacement_id: '',
          injury: false
        }
      }
    },
    computed: {
      ...mapState('player', {
        players: 'list'
      }),
      ...mapGetters('player', {
        activePlayers: 'active'
      }),
      availablePlayers () {
        const selectedIds = this.match.match_logs.map(p => p.player_id)
        return this.activePlayers.filter(p => selectedIds.indexOf(p.id) < 0)
      }
    },
    watch: {
      'substitution.player_id': function (val) {
        this.substitution.player_name = val
          ? this.players[val].name
          : ''
      },
      'substitution.replacement_id': function (val) {
        this.substitution.replaced_by = val
          ? this.players[val].name
          : ''
      }
    },
    methods: {
      ...mapActions('substitution', [
        'create'
      ]),
      async submit () {
        if (this.$refs.form.validate()) {
          try {
            await this.create({
              matchId: this.match.id,
              substitution: this.substitution
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
