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
            <v-container>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="squad.name"
                    :rules="$_validate('Name', ['required'])"
                    label="Name"
                    prepend-inner-icon="people_outline"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout
                v-for="(position, i) in squad.positions_list"
                :key="i"
                row
                wrap>
                <v-flex xs4>
                  <v-select
                    v-model="squad.positions_list[i]"
                    :items="positions"
                    label="Position"
                    prepend-icon="directions_run"
                    hide-details
                    auto
                    offset-y
                  ></v-select>
                </v-flex>
                <v-flex xs8>
                  <v-select
                    v-model="squad.players_list[i]"
                    :items="players"
                    item-value="id"
                    item-text="name"
                    label="Player"
                    prepend-icon="person"
                    hide-details
                    auto
                    offset-y>
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
  import { mapState, mapGetters, mapActions } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [ FormBase, TeamAction ],
    props: {
      initialSquad: {
        type: Object
      }
    },
    data () {
      return {
        valid: !!this.initialSquad,
        squad: Object.assign({
          name: '',
          players_list: [],
          positions_list: []
        }, {
          ...this.initialSquad,
          players_list: ((this.initialSquad || {}).players_list || []).map(p => parseInt(p)),
          positions_list: ((this.initialSquad || {}).positions_list || []).slice()
        })
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
        return this.squad.id ? 'Edit Squad' : 'New Squad'
      }
    },
    watch: {
      inForm (val) {
        if (!val) {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        } else if (!('id' in this.squad)) {
          for (let i = 0; i < 11; i++) {
            this.squad.players_list.push(null)
            this.squad.positions_list.push(null)
          }
        }
      }
    },
    methods: {
      ...mapActions('squad', [
        'create',
        'update'
      ]),
      async submit () {
        if (this.$refs.form.validate()) {
          let params, save
          if (this.initialSquad) {
            params = this.squad
            save = this.update
          } else {
            params = { teamId: this.team.id, squad: this.squad }
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
