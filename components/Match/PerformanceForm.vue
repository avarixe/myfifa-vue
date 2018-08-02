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
            v-model="performance.pos"
            :items="positions"
            :rules="$_validate('Position', ['required'])"
            label="Position"
            prepend-icon="directions_run"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="performance.player_id"
            :items="players"
            item-text="name"
            item-value="id"
            :rules="$_validate('Player', ['required'])"
            :disabled="performance.start > 0"
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
      performanceId: {
        type: Number
      },
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        performance: {
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
        return this.performance.id ? 'Edit Position' : 'Add Position'
      }
    },
    watch: {
      async dialog (val) {
        if (val && this.performanceId) {
          try {
            const { data } = await this.get({
              performanceId: this.performanceId
            })
            this.performance = data
          } catch (e) {
            alert(e.message)
            this.dialog = false
          }
        }
      }
    },
    methods: {
      ...mapActions('performance', [
        'get',
        'create',
        'update'
      ]),
      async submit () {
        if (this.performanceId) {
          await this.update(this.performance)
        } else {
          await this.create({
            matchId: this.match.id,
            performance: this.performance
          })
        }
      }
    }
  }
</script>
