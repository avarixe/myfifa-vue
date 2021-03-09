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
      <v-col cols="12">
        <v-text-field
          v-model="player.name"
          label="Name"
          prepend-icon="mdi-account"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <nationality-field v-model="player.nationality" />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="player.pos"
          label="Position"
          prepend-icon="mdi-run"
          :items="positions"
          :rules="rulesFor.pos"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="player.sec_pos"
          label="Secondary Position(s)"
          prepend-icon="mdi-walk"
          :items="positions"
          multiple
          chips
          deletable-chips
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="player.age"
          label="Age"
          prepend-icon="mdi-calendar"
          :rules="rulesFor.age"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="player.ovr"
          label="OVR"
          prepend-icon="mdi-trending-up"
          :rules="rulesFor.ovr"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model="player.value"
          label="Value"
          :prefix="team.currency"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="player.kit_no"
          label="Kit Number"
          prepend-icon="mdi-tshirt-crew"
          :rules="rulesFor.kit_no"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="player.youth"
          label="Youth Player"
          :disabled="record !== null"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DialogFormable, TeamAccessible } from '@/mixins'
  import { positions } from '@/constants'
  import { isRequired, inRange, isNumber } from '@/functions'

  export default {
    name: 'PlayerForm',
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      valid: false,
      player: {
        name: '',
        pos: '',
        nationality: null,
        sec_pos: [],
        ovr: null,
        value: '',
        kit_no: null,
        age: null,
        youth: false
      },
      rulesFor: {
        name: [isRequired('Name')],
        pos: [isRequired('Position')],
        age: [
          isRequired('Age'),
          isNumber('Age')
        ],
        ovr: [
          isRequired('OVR'),
          isNumber('OVR'),
          inRange('OVR', [40, 100])
        ],
        kit_no: [
          isNumber('Kit Number'),
          inRange('Kit Number', [1, 99])
        ]
      },
      positions
    }),
    computed: {
      title () {
        return this.record ? `Edit ${this.player.name}` : 'New Player'
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.player = pick(this.record, [
            'id',
            'name',
            'pos',
            'age',
            'nationality',
            'ovr',
            'value',
            'kit_no',
            'youth'
          ])
          this.player.sec_pos = [...this.record.sec_pos]
        }
      }
    },
    methods: {
      ...mapActions('players', {
        createPlayer: 'create',
        updatePlayer: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updatePlayer(this.player)
        } else {
          const { id: playerId } = await this.createPlayer({
            teamId: this.team.id,
            player: this.player
          })
          this.$router.push({
            name: 'teams-teamId-players-playerId',
            params: {
              teamId: this.team.id,
              playerId
            }
          })
        }
      }
    }
  }
</script>
