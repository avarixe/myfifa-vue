<template>
  <dialog-form
    v-model="dialog"
    :title="`Edit ${team.title}`"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-btn v-on="on">
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Team
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
  import { DynamicFields } from '@/helpers'
  import { DialogFormable } from '@/mixins'

  const teams = namespace('teams')

  @Component({
    components: {
      DynamicFields
    }
  })
  export default class TeamForm extends mixins(DialogFormable) {
    @teams.Action('UPDATE') updateTeam
    @Prop(Object) record

    team = {}

    get fields () {
      return [
        {
          type: 'string',
          object: this.team,
          attribute: 'title',
          label: 'Team',
          prependIcon: 'mdi-shield-half-full',
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          type: 'string',
          object: this.team,
          attribute: 'currency',
          label: 'Currency',
          prependIcon: 'mdi-cash',
          required: true
        },
        {
          type: 'file',
          object: this.team,
          attribute: 'badge',
          label: 'Badge'
        }
      ]
    }

    @Watch('dialog')
    setTeam (val) {
      if (val && this.record) {
        this.team = pick(this.record, [
          'id',
          'title',
          'started_on',
          'currency',
          'badge'
        ])
      }
    }

    async submit () {
      const formData = new FormData()

      for (let k in this.team) {
        formData.append(`team[${k}]`, this.team[k])
      }

      await this.updateTeam({
        id: this.team.id,
        formData
      })
    }
  }
</script>
