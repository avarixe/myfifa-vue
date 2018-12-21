<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
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
            prepend-icon="mdi-run"
            hide-details
          ></v-select>
        </v-flex>
        <v-flex xs8>
          <v-select
            v-model="squad.players_list[i]"
            :items="players"
            item-value="id"
            item-text="name"
            label="Player"
            prepend-icon="mdi-account"
            hide-details>
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
  import { activePlayers } from '@/api/modules/Player'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import DialogFormable from '@/mixins/DialogFormable'

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
          players_list: ((this.squadData || {}).players_list || []).map(p => parseInt(p)),
          positions_list: ((this.squadData || {}).positions_list || []).slice()
        })
      }
    },
    computed: {
      ...mapState('entities/matches', [
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
      ...mapActions('entities/squads', {
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
