<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-btn
          v-on="on"
          color="blue-grey"
          outlined
        >
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Player
        </v-btn>
      </slot>
    </template>

    <template #form>
      <v-container>
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
            />
          </v-flex>
          <v-flex xs12>
            <v-select
              v-model="player.pos"
              :rules="$_validate('Position', ['required'])"
              :items="positions"
              label="Position"
              prepend-icon="mdi-run"
            />
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
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="player.birth_year"
              label="Birth Year"
              prepend-icon="mdi-calendar"
              mask="####"
              :rules="$_validate('Birth Year', ['required'])"
            />
          </v-flex>
          <v-flex xs12>
            <v-select
              v-model="player.ovr"
              :items="Array.from({ length: 61 }, (v, k) => k + 40)"
              :rules="$_validate('OVR', ['required'])"
              label="OVR"
              prepend-icon="mdi-trending-up"
            />
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
            />
          </v-flex>
          <v-flex xs12>
            <v-checkbox
              v-model="player.youth"
              label="Youth Player"
              :disabled="player.id > 0"
              hide-details
            />
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
  import {
    DialogFormable,
    TeamAccessible
  } from '@/mixins'

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
          birth_year: null,
          youth: false
        }
      }
    },
    computed: {
      ...mapState('players', [
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
              'id',
              'name',
              'pos',
              'sec_pos',
              'ovr',
              'value',
              'birth_year',
              'youth'
            ]))
          }
        }
      }
    },
    methods: {
      ...mapActions('players', {
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
            name: 'teams-teamId-players-playerId',
            params: {
              teamId: this.team.id,
              playerId: data.id
            }
          })
        }
      }
    }
  }
</script>
