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
      <v-container grid-list-xs>
        <v-layout wrap>
          <v-flex xs12>
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
          </v-flex>
          <v-flex xs12>
            <v-date-field
              v-model="team.start_date"
              label="Start Date"
              prepend-icon="mdi-calendar-today"
              :rules="$_validate('Start Date', ['required', 'date'])"
              :color="color"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="team.currency"
              :rules="$_validate('Currency', ['required'])"
              label="Currency"
              prepend-icon="mdi-cash"
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
  import { Team } from '@/models'
  import { VDateField } from '@/helpers'
  import { DialogFormable } from '@/mixins'
  import { format } from 'date-fns'

  @Component({
    components: {
      VDateField
    },
    methods: mapActions('teams', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class TeamForm extends mixins(DialogFormable) {
    @Prop([String, Number]) teamId

    team = {
      title: '',
      start_date: format(new Date(), 'YYYY-MM-DD'),
      currency: '$'
    }

    get title () {
      return this.teamId
        ? `Edit ${this.team.title}`
        : 'New Team'
    }

    @Watch('dialog')
    setTeam (val) {
      if (val && this.teamId) {
        Object.assign(
          this.team,
          this.$_pick(Team.find(this.teamId), [
            'id', 'title', 'start_date', 'currency'
          ])
        )
      }
    }

    async submit () {
      if ('id' in this.team) {
        await this.update(this.team)
      } else {
        const { data } = await this.create(this.team)

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
