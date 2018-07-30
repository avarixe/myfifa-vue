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
      logId: {
        type: Number
      },
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        match_log: {
          player_id: null,
          pos: ''
        }
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
    watch: {
      async dialog (val) {
        if (val && this.logId) {
          try {
            const { data } = await this.get({ logId: this.logId })
            this.match_log = data
          } catch (e) {
            alert(e.message)
            this.dialog = false
          }
        }
      }
    },
    methods: {
      ...mapActions('matchLog', [
        'get',
        'create',
        'update'
      ]),
      async submit () {
        if (this.logId) {
          await this.update(this.match_log)
        } else {
          await this.create({
            matchId: this.match.id,
            matchLog: this.match_log
          })
        }
      }
    }
  }
</script>
