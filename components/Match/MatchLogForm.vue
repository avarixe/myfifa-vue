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
          <v-select
            v-model="match_log.pos"
            :items="positions"
            :rules="$_validate('Position', ['required'])"
            label="Position"
            prepend-icon="directions_run"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="match_log.player_id"
            :items="players"
            item-text="name"
            item-value="id"
            :rules="$_validate('Player', ['required'])"
            :disabled="match_log.start > 0"
            label="Player"
            prepend-icon="person">
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
  import { mapState, mapGetters, mapActions } from 'vuex'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [
      FormBase
    ],
    props: {
      initialLog: {
        type: Object
      },
      match: {
        type: Object,
        required: true
      }
    },
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
      }
    },
    methods: {
      ...mapActions('match', {
        create: 'addLog',
        update: 'updateLog'
      }),
      submit () {
        if ('id' in this.match_log) {
          this.update(this.match_log)
        } else {
          this.create({
            matchId: this.match.id,
            matchLog: this.match_log
          })
        }
      }
    }
  }
</script>
