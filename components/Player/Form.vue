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
          color="blue-grey"
          outlined
          v-on="on"
        >
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Player
        </v-btn>
      </slot>
    </template>

    <template #form>
      <v-container grid-list-xs>
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
            <v-checkbox
              v-model="player.youth"
              label="Youth Player"
              :disabled="player.id > 0"
              hide-details
            />
          </v-flex>

          <v-flex xs12>
            <v-select
              v-model="player.kit_no"
              :items="Array.from({ length: 99 }, (v, k) => k + 1)"
              label="Kit Number"
              prepend-icon="mdi-tshirt-crew"
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
            <v-money-field
              v-model="player.value"
              label="Value"
              :prefix="team.currency"
              required
            />
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { DialogFormable, TeamAccessible } from '@/mixins'
  import { positions } from '@/models/Player'
  import { VMoneyField } from '@/helpers'

  const mix = mixins(DialogFormable, TeamAccessible)

  @Component({
    components: {
      VMoneyField
    },
    methods: mapActions('players', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class PlayerForm extends mix {
    @Prop(Object) playerData
    @Prop(Function) submitCb

    valid = false
    player = {
      name: '',
      pos: '',
      sec_pos: [],
      ovr: 60,
      value: '',
      birth_year: null,
      youth: false
    }

    get title () {
      return this.player.id ? 'Edit ' + this.player.name : 'New Player'
    }

    get positions () {
      return positions
    }

    @Watch('dialog')
    setPlayer (val) {
      this.valid = !!this.playerData
      if (this.playerData) {
        Object.assign(this.player, this.$_pick(this.playerData, [
          'id',
          'name',
          'pos',
          'sec_pos',
          'ovr',
          'value',
          'birth_year',
          'youth'
        ]))
        this.player.sec_pos = [...this.playerData.sec_pos]
      }
    }

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
</script>
