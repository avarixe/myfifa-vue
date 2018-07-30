<template>
  <dialog-form
    v-model="dialog"
    title-icon="repeat"
    title="Record Substitution"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-select
            v-model="substitution.minute"
            :items="Array.from({ length: 120 }, (v, k) => k + 1)"
            :rules="$_validate('Minute', ['required'])"
            label="Minute"
            prepend-icon="timer"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="substitution.player_id"
            :rules="$_validate('Player', ['required'])"
            :items="match.match_logs"
            item-value="player_id"
            item-text="name"
            label="Player"
            prepend-icon="subdirectory_arrow_left">
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
        <v-flex xs12>
          <v-select
            v-model="substitution.replacement_id"
            :rules="$_validate('Replaced By', ['required'])"
            :items="availablePlayers"
            item-value="id"
            item-text="name"
            label="Replaced By"
            prepend-icon="subdirectory_arrow_right">
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
        <v-flex xs12>
          <v-checkbox
            label="Injury"
            v-model="substitution.injury"
            hide-details
          ></v-checkbox>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [
      FormBase,
      TeamAction
    ],
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        substitution: {
          minute: null,
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
        await this.create({
          matchId: this.match.id,
          substitution: this.substitution
        })
      }
    }
  }
</script>
