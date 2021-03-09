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
      <v-col cols="12">
        <v-text-field
          v-model="team.title"
          label="Team"
          prepend-icon="mdi-shield-half-full"
          :rules="rulesFor.title"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-date-field
          v-model="team.started_on"
          label="Start Date"
          prepend-icon="mdi-calendar-today"
          :disabled="record"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="team.currency"
          label="Currency"
          prepend-icon="mdi-cash"
          :rules="rulesFor.currency"
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
  import { mapActions } from 'vuex'
  import { format } from 'date-fns'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'TeamForm',
    mixins: [
      DialogFormable
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      team: {
        title: '',
        started_on: format(new Date(), 'yyyy-MM-dd'),
        currency: '$',
        badge: null
      },
      rulesFor: {
        title: [isRequired('Title')],
        currency: [isRequired('Currency')]
      }
    }),
    computed: {
      title () {
        return this.record ? `Edit ${this.record.title}` : 'New Team'
      }
    },
    watch: {
      dialog (val) {
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
    },
    methods: {
      ...mapActions('teams', {
        createTeam: 'create',
        updateTeam: 'update'
      }),
      async submit () {
        const formData = new FormData()

        for (let k in this.team) {
          if (this.team[k]) {
            formData.append(`team[${k}]`, this.team[k])
          }
        }

        if (this.record) {
          await this.updateTeam({
            team: { id: this.team.id },
            formData
          })
        } else {
          const { id: teamId } = await this.createTeam({ formData })
          this.$router.push({
            name: 'teams-teamId',
            params: { teamId }
          })
        }
      }
    }
  }
</script>
