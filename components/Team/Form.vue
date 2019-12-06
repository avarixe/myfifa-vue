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
          Team
        </v-btn>
      </slot>
    </template>

    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="team.title"
          :rules="$_validate('Team', ['required'])"
          label="Team"
          prepend-icon="mdi-shield-half-full"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col
        v-if="!teamId"
        cols="12"
      >
        <v-date-field
          v-model="team.started_on"
          label="Start Date"
          prepend-icon="mdi-calendar-today"
          :color="color"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="team.currency"
          :rules="$_validate('Currency', ['required'])"
          label="Currency"
          prepend-icon="mdi-cash"
        />
      </v-col>
      <v-col cols="12">
        <v-file-input
          v-model="team.badge"
          label="Badge"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import { Team } from '@/models'
  import { VDateField } from '@/helpers'
  import { DialogFormable } from '@/mixins'
  import { format } from 'date-fns'

  const teams = namespace('teams')

  @Component({
    components: {
      VDateField
    }
  })
  export default class TeamForm extends mixins(DialogFormable) {
    @teams.Action('CREATE') createTeam
    @teams.Action('UPDATE') updateTeam
    @Prop([String, Number]) teamId

    team = {
      title: '',
      started_on: format(new Date(), 'yyyy-MM-dd'),
      currency: '$',
      badge: null
    }

    get title () {
      return this.teamId
        ? `Edit ${this.team.title}`
        : 'New Team'
    }

    @Watch('dialog')
    setTeam (val) {
      if (val && this.teamId) {
        this.team = this.$_pick(Team.find(this.teamId), [
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

      if ('id' in this.team) {
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
