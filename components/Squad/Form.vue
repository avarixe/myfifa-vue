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
          Squad
        </v-btn>
      </slot>
    </template>

    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="squad.name"
          :rules="$_validate('Name', ['required'])"
          label="Name"
          prepend-icon="mdi-clipboard-text"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-row
        v-for="(squadPlayer, i) in squad.squad_players_attributes"
        :key="i"
        dense
      >
        <v-col cols="4">
          <v-select
            v-model="squadPlayer.pos"
            :items="positions"
            label="Position"
            prepend-icon="mdi-run"
            hide-details
          />
        </v-col>
        <v-col cols="8">
          <player-select
            v-model="squadPlayer.player_id"
            :players="players"
            item-value="id"
            label="Player"
            hide-details
          />
        </v-col>
      </v-row>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { positions } from '@/models/Match'
  import { activePlayers } from '@/models/Player'
  import { PlayerSelect } from '@/helpers'
  import { DialogFormable, TeamAccessible } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)
  const squads = namespace('squads')

  @Component({
    components: {
      PlayerSelect
    }
  })
  export default class SquadForm extends mix {
    @squads.Action('CREATE') createSquad
    @squads.Action('UPDATE') updateSquad
    @Prop(Object) squadData

    valid = false
    squad = {
      name: '',
      squad_players_attributes: new Array(11).fill().map(x => ({
        player_id: null,
        pos: null
      }))
    }

    get positions () {
      return Object.keys(positions)
    }

    get title () {
      return this.squadData ? 'Edit Squad' : 'New Squad'
    }

    get players () {
      return activePlayers(this.team.id)
    }

    @Watch('dialog')
    setSquad (val) {
      if (val && this.squadData) {
        this.squad = pick(this.squadData, [
          'id',
          'name'
        ])
        this.squad.squad_players_attributes = this.squadData.squad_players
          .map(squadPlayer => ({
            id: squadPlayer.id,
            player_id: squadPlayer.player_id,
            pos: squadPlayer.pos
          }))
      }
    }

    async submit () {
      if (this.squadData) {
        await this.updateSquad(this.squad)
      } else {
        await this.createSquad({
          teamId: this.team.id,
          squad: this.squad
        })
      }
    }
  }
</script>
