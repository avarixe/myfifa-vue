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
      <dynamic-fields :fields="fields" />
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { positions } from '@/models/Match'
  import { activePlayers } from '@/models/Player'
  import { DynamicFields } from '@/helpers'
  import { DialogFormable, TeamAccessible } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)
  const squads = namespace('squads')

  @Component({
    components: {
      DynamicFields
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

    get title () {
      return this.squadData ? 'Edit Squad' : 'New Squad'
    }

    get fields () {
      let fields = [
        {
          type: 'string',
          object: this.squad,
          attribute: 'name',
          label: 'Name',
          prependIcon: 'mdi-clipboard-text',
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        }
      ]

      for (const i in this.squad.squad_players_attributes) {
        fields.push({
          cols: 4,
          type: 'select',
          object: this.squad.squad_players_attributes[i],
          attribute: 'pos',
          label: 'Position',
          prependIcon: 'mdi-run',
          items: this.positions,
          required: true,
          hideDetails: true
        })
        fields.push({
          cols: 8,
          type: 'player',
          object: this.squad.squad_players_attributes[i],
          attribute: 'player_id',
          prependIcon: 'mdi-account',
          players: this.players,
          itemValue: 'id',
          required: true,
          hideDetails: true
        })
      }

      return fields
    }

    get positions () {
      return Object.keys(positions)
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
