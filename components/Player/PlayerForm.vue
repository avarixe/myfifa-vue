<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            v-model="player.name"
            :rules="$_validate('Name', ['required'])"
            label="Name"
            prepend-icon="mdi-account"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="player.pos"
            :rules="$_validate('Position', ['required'])"
            :items="positions"
            label="Position"
            prepend-icon="mdi-run"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="player.sec_pos"
            :items="positions"
            label="Secondary Position(s)"
            prepend-icon="mdi-walk"
            multiple
            chips
            deletable-chips
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="player.birth_year"
            label="Birth Year"
            prepend-icon="mdi-calendar"
            mask="####"
            :rules="$_validate('Birth Year', ['required'])"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="player.ovr"
            :items="Array.from({ length: 61 }, (v, k) => k + 40)"
            :rules="$_validate('OVR', ['required'])"
            label="OVR"
            prepend-icon="mdi-trending-up"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="player.value"
            :rules="$_validate('Value', ['required'])"
            type="number"
            label="Value"
            :prefix="team.currency"
            :hint="$_numberHint(player.value)"
            persistent-hint
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-checkbox
            label="Youth Player"
            v-model="player.youth"
            :disabled="player.id > 0"
            hide-details
          ></v-checkbox>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import DialogFormable from '@/mixins/DialogFormable'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      playerData: {
        type: Object,
        default: () => ({})
      },
      submitCb: Function
    },
    data () {
      return {
        valid: false,
        player: {
          name: '',
          pos: '',
          sec_pos: [],
          ovr: 60,
          value: '',
          birth_year: 16,
          youth: false
        }
      }
    },
    computed: {
      ...mapState('entities/players', [
        'positions'
      ]),
      title () {
        return this.player.id ? 'Edit ' + this.player.name : 'New Player'
      }
    },
    watch: {
      playerData: {
        immediate: true,
        handler (val) {
          this.valid = !!val
          if (val) {
            Object.assign(this.player, this.$_pick(val, [
              'id', 'name', 'pos', 'sec_pos', 'ovr', 'value', 'birth_year', 'youth'
            ]))
          }
        }
      }
    },
    methods: {
      ...mapActions('entities/players', {
        create: 'CREATE',
        update: 'UPDATE'
      }),
      async submit () {
        if ('id' in this.player) {
          await this.update(this.player)
        } else {
          const { data } = await this.create({
            teamId: this.team.id,
            player: this.player
          })
          this.$router.push({
            name: 'teams-id-players-playerId',
            params: {
              id: this.team.id,
              playerId: data.id
            }
          })
        }
      }
    }
  }
</script>
