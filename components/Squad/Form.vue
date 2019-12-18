<template>
  <dialog-form
    v-model="dialog"
    title="Edit Squad"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <template #form>
      <dynamic-fields :fields="fields">
        <template #field.player="{ object, attribute }">
          <player-select
            v-model="object[attribute]"
            :players="players"
            item-value="id"
            label="Player"
            hide-details
          />
        </template>
      </dynamic-fields>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { positions } from '@/models/Match'
  import { activePlayers } from '@/models/Player'
  import { DynamicFields, PlayerSelect } from '@/helpers'
  import { DialogFormable, TeamAccessible } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)
  const squads = namespace('squads')

  @Component({
    components: {
      DynamicFields,
      PlayerSelect
    }
  })
  export default class SquadForm extends mix {
    @squads.Action('CREATE') createSquad
    @squads.Action('UPDATE') updateSquad
    @Prop(Object) record

    valid = false
    squad = {
      name: '',
      squad_players_attributes: new Array(11).fill().map(x => ({
        player_id: null,
        pos: null
      }))
    }

    get title () {
      return this.record ? 'Edit Squad' : 'New Squad'
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
          slot: 'player',
          object: this.squad.squad_players_attributes[i],
          attribute: 'player_id'
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
      if (val && this.record) {
        this.squad = pick(this.record, [
          'id',
          'name'
        ])
        this.squad.squad_players_attributes = this.record.squad_players
          .map(squadPlayer => ({
            id: squadPlayer.id,
            player_id: squadPlayer.player_id,
            pos: squadPlayer.pos
          }))
      }
    }

    async submit () {
      if (this.record) {
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
