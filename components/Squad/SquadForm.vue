<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <template #form>
      <v-container>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              v-model="squad.name"
              :rules="$_validate('Name', ['required'])"
              label="Name"
              prepend-icon="mdi-clipboard-text"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-flex>
        </v-layout>

        <v-layout
          v-for="(position, i) in squad.positions_list"
          :key="i"
          row
          wrap
        >
          <v-flex xs4>
            <v-select
              v-model="squad.positions_list[i]"
              :items="positions"
              label="Position"
              prepend-icon="mdi-run"
              hide-details
            />
          </v-flex>

          <v-flex xs8>
            <v-select
              v-model="squad.players_list[i]"
              :items="players"
              item-value="id"
              item-text="name"
              label="Player"
              prepend-icon="mdi-account"
              hide-details
            >
              <template #item="{ item }">
                <v-list-item-action>
                  <v-list-item-action-text>
                    {{ item.pos }}
                  </v-list-item-action-text>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </template>
            </v-select>
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import {
    mapState,
    mapActions
  } from 'vuex'
  import { activePlayers } from '@/models/Player'
  import {
    TeamAccessible,
    DialogFormable
  } from '@/mixins'

  export default {
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      squadData: Object
    },
    data () {
      return {
        valid: !!this.squadData,
        squad: Object.assign({
          name: '',
          players_list: [],
          positions_list: []
        }, {
          ...this.squadData,
          players_list:
            ((this.squadData || {}).players_list || []).map(p => parseInt(p)),
          positions_list: ((this.squadData || {}).positions_list || []).slice()
        })
      }
    },
    computed: {
      ...mapState('matches', [
        'positions'
      ]),
      title () {
        return this.squad.id ? 'Edit Squad' : 'New Squad'
      },
      players () {
        return activePlayers(this.team.id)
      }
    },
    watch: {
      dialog (val) {
        if (!val) {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        } else {
          if (!('id' in this.squad)) {
            for (let i = 0; i < 11; i++) {
              this.squad.players_list.push(null)
              this.squad.positions_list.push(null)
            }
          }
        }
      }
    },
    methods: {
      ...mapActions('squads', {
        create: 'CREATE',
        update: 'UPDATE'
      }),
      async submit () {
        if (this.squadData) {
          await this.update(this.squad)
        } else {
          await this.create({
            teamId: this.team.id,
            squad: this.squad
          })
        }
      }
    }
  }
</script>
