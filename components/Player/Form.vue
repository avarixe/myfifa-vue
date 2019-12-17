<template>
  <dialog-form
    v-model="dialog"
    title="Edit Player"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <template #form>
      <dynamic-fields :fields="fields" />
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { DialogFormable, TeamAccessible } from '@/mixins'
  import { positions } from '@/models/Player'
  import { DynamicFields } from '@/helpers'

  const players = namespace('players')

  @Component({
    components: {
      DynamicFields
    }
  })
  export default class PlayerForm extends mixins(DialogFormable, TeamAccessible) {
    @players.Action('UPDATE') updatePlayer
    @Prop(Object) playerData

    valid = false
    player = {}

    get fields () {
      return [
        {
          type: 'string',
          object: this.player,
          attribute: 'name',
          label: 'Name',
          prependIcon: 'mdi-account',
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          type: 'nationality',
          object: this.player,
          attribute: 'nationality'
        },
        {
          type: 'select',
          object: this.player,
          attribute: 'pos',
          label: 'Position',
          prependIcon: 'mdi-run',
          items: positions,
          required: true
        },
        {
          type: 'select',
          object: this.player,
          attribute: 'sec_pos',
          label: 'Secondary Position(s)',
          prependIcon: 'mdi-walk',
          items: positions,
          multiple: true
        },
        {
          type: 'string',
          object: this.player,
          attribute: 'birth_year',
          label: 'Birth Year',
          prependIcon: 'mdi-calendar',
          required: true,
          inputmode: 'numeric'
        },
        {
          type: 'string',
          object: this.player,
          attribute: 'ovr',
          label: 'OVR',
          prependIcon: 'mdi-trending-up',
          required: true,
          inputmode: 'numeric',
          range: { min: 40, max: 100 }
        },
        {
          type: 'money',
          object: this.player,
          attribute: 'value',
          label: 'Value',
          prefix: this.team.currency,
          required: true
        },
        {
          type: 'string',
          object: this.player,
          attribute: 'kit_no',
          label: 'Kit Number',
          prependIcon: 'mdi-tshirt-crew',
          inputmode: 'numeric',
          range: { min: 1, max: 99 }
        },
        {
          type: 'checkbox',
          object: this.player,
          attribute: 'youth',
          label: 'Youth Player',
          disabled: true,
          hideDetails: true
        }
      ]
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
      await this.updatePlayer(this.player)
    }
  }
</script>
