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
            v-model="cap.pos"
            :items="positions"
            :rules="$_validate('Position', ['required'])"
            label="Position"
            prepend-icon="mdi-run"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="cap.player_id"
            :items="players"
            item-text="name"
            item-value="id"
            :rules="$_validate('Player', ['required'])"
            :disabled="cap.start > 0"
            label="Player"
            prepend-icon="mdi-account">
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
  import DialogFormable from '@/mixins/DialogFormable'

  export default {
    mixins: [ DialogFormable ],
    props: {
      capId: {
        type: Number
      },
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        cap: {
          player_id: null,
          pos: ''
        }
      }
    },
    computed: {
      ...mapState('match', [
        'positions'
      ]),
      players () {
        return activePlayers(parseInt(this.$route.params.teamId))
      },
      title () {
        return this.cap.id ? 'Edit Position' : 'Add Position'
      }
    },
    watch: {
      async dialog (val) {
        if (val && this.capId) {
          try {
            const { data } = await this.get({
              capId: this.capId
            })
            this.cap = data
          } catch (e) {
            alert(e.message)
            this.dialog = false
          }
        }
      }
    },
    methods: {
      ...mapActions('cap', [
        'get',
        'create',
        'update'
      ]),
      async submit () {
        if (this.capId) {
          await this.update(this.cap)
        } else {
          await this.create({
            matchId: this.match.id,
            cap: this.cap
          })
        }
      }
    }
  }
</script>
