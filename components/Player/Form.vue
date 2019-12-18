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
      <dynamic-fields
        :object="player"
        :fields="fields"
      >
        <template #field.nationality>
          <nationality-field v-model="player.nationality" />
        </template>
      </dynamic-fields>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { DialogFormable, TeamAccessible } from '@/mixins'
  import { positions } from '@/models/Player'
  import { DynamicFields, NationalityField } from '@/helpers'

  const players = namespace('players')

  @Component({
    components: {
      DynamicFields,
      NationalityField
    }
  })
  export default class PlayerForm extends mixins(DialogFormable, TeamAccessible) {
    @players.Action('UPDATE') updatePlayer
    @players.Action('CREATE') createPlayer
    @Prop(Object) record

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
      return this.record ? `Edit ${this.player.name}` : 'New Player'
    }

    get fields () {
      return [
        {
          type: 'string',
          attribute: 'name',
          label: 'Name',
          prependIcon: 'mdi-account',
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        { slot: 'nationality' },
        {
          type: 'select',
          attribute: 'pos',
          label: 'Position',
          prependIcon: 'mdi-run',
          items: positions,
          required: true
        },
        {
          type: 'select',
          attribute: 'sec_pos',
          label: 'Secondary Position(s)',
          prependIcon: 'mdi-walk',
          items: positions,
          multiple: true
        },
        {
          type: 'string',
          attribute: 'birth_year',
          label: 'Birth Year',
          prependIcon: 'mdi-calendar',
          required: true,
          inputmode: 'numeric'
        },
        {
          type: 'string',
          attribute: 'ovr',
          label: 'OVR',
          prependIcon: 'mdi-trending-up',
          required: true,
          inputmode: 'numeric',
          range: { min: 40, max: 100 }
        },
        {
          type: 'money',
          attribute: 'value',
          label: 'Value',
          prefix: this.team.currency,
          required: true
        },
        {
          type: 'string',
          attribute: 'kit_no',
          label: 'Kit Number',
          prependIcon: 'mdi-tshirt-crew',
          inputmode: 'numeric',
          range: { min: 1, max: 99 }
        },
        {
          type: 'checkbox',
          attribute: 'youth',
          label: 'Youth Player',
          disabled: this.player.id > 0,
          hideDetails: true
        }
      ]
    }

    @Watch('dialog')
    setPlayer (val) {
      if (val && this.record) {
        this.player = pick(this.record, [
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
        this.player.sec_pos = [...this.record.sec_pos]
      }
    }

    async submit () {
      if (this.record) {
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
