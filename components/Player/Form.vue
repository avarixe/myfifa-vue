<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-btn v-on="on">
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Player
        </v-btn>
      </slot>
    </template>

    <template #form>
      <v-col cols="12">
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
      </v-col>
      <v-col cols="12">
        <nationality-field v-model="player.nationality" />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="player.pos"
          :rules="$_validate('Position', ['required'])"
          :items="positions"
          label="Position"
          prepend-icon="mdi-run"
          menu-props="auto"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="player.sec_pos"
          :items="positions"
          label="Secondary Position(s)"
          prepend-icon="mdi-walk"
          multiple
          chips
          deletable-chips
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="player.birth_year"
          label="Birth Year"
          prepend-icon="mdi-calendar"
          :rules="$_validate('Birth Year', ['required'])"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="player.youth"
          label="Youth Player"
          :disabled="player.id > 0"
          hide-details
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="player.kit_no"
          :items="Array.from({ length: 99 }, (v, k) => k + 1)"
          label="Kit Number"
          prepend-icon="mdi-tshirt-crew"
          menu-props="auto"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="player.ovr"
          :items="Array.from({ length: 61 }, (v, k) => k + 40)"
          :rules="$_validate('OVR', ['required'])"
          label="OVR"
          prepend-icon="mdi-trending-up"
          menu-props="auto"
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
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { DialogFormable, TeamAccessible } from '@/mixins'
  import { positions } from '@/models/Player'
  import { NationalityField, VMoneyField } from '@/helpers'

  const players = namespace('players')

  @Component({
    components: {
      NationalityField,
      VMoneyField
    }
  })
  export default class PlayerForm extends mixins(DialogFormable, TeamAccessible) {
    @players.Action('CREATE') createPlayer
    @players.Action('UPDATE') updatePlayer
    @Prop(Object) playerData

    valid = false
    player = {
      name: '',
      pos: '',
      nationality: null,
      sec_pos: [],
      ovr: 60,
      value: '',
      kit_no: null,
      birth_year: null,
      youth: false
    }

    get title () {
      return this.playerData ? 'Edit ' + this.player.name : 'New Player'
    }

    get positions () {
      return positions
    }

    @Watch('dialog')
    setPlayer (val) {
      if (val && this.playerData) {
        this.player = pick(this.playerData, [
          'id',
          'name',
          'pos',
          'nationality',
          'ovr',
          'value',
          'kit_no',
          'birth_year',
          'youth'
        ])
        this.player.sec_pos = [...this.playerData.sec_pos]
      }
    }

    async submit () {
      if (this.playerData) {
        await this.updatePlayer(this.player)
      } else {
        const { data } = await this.createPlayer({
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
