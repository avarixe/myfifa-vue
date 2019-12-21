<template lang="pug">
  dialog-form(
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  )
    template(#activator="{ on }")
      slot(:on="on")
    template(#form)
      dynamic-fields(:object="team" :fields="fields")
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import { format } from 'date-fns'
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
    @teams.Action('CREATE') createTeam
    @teams.Action('UPDATE') updateTeam
    @Prop(Object) record

    team = {
      title: '',
      started_on: format(new Date(), 'yyyy-MM-dd'),
      currency: '$',
      badge: null
    }

    get title () {
      return this.record ? `Edit ${this.record.title}` : 'New Team'
    }

    get fields () {
      return [
        {
          type: 'string',
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
          type: 'date',
          attribute: 'started_on',
          label: 'Start Date',
          prependIcon: 'mdi-calendar-today',
          disabled: this.team.id > 0,
          required: true
        },
        {
          type: 'string',
          attribute: 'currency',
          label: 'Currency',
          prependIcon: 'mdi-cash',
          required: true
        },
        {
          type: 'file',
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

      if (this.record) {
        await this.updateTeam({
          id: this.team.id,
          formData
        })
      } else {
        const { data } = await this.createTeam(formData)
        this.$router.push({
          name: 'teams-teamId',
          params: {
            teamId: data.id
          }
        })
      }
    }
  }
</script>
