<template>
  <v-container fluid>
    <v-form
      ref="form"
      v-model="valid"
      style="width:100%"
      @submit.prevent="submitForm"
    >
      <dynamic-fields :fields="fields" />
      <v-row>
        <v-col
          v-if="formError"
          cols="12"
        >
          <v-alert
            v-model="formError"
            type="error"
            dismissible
          >
            {{ errorMessage }}
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-btn
            type="submit"
            color="primary"
            text
            large
            :loading="loading"
            :disabled="!valid"
          >
            Save
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
  import { Component, Vue, namespace } from 'nuxt-property-decorator'
  import { format } from 'date-fns'
  import { DynamicFields } from '@/helpers'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      DynamicFields
    },
    transition: 'fade-transition'
  })
  export default class NewTeamPage extends Vue {
    @app.Mutation('SET_PAGE') setPage

    valid = false
    loading = false
    errorMessage = ''
    formError = false
    team = {
      title: '',
      started_on: format(new Date(), 'yyyy-MM-dd'),
      currency: '$',
      badge: null
    }
    fields = [
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
        type: 'date',
        object: this.team,
        attribute: 'started_on',
        label: 'Start Date',
        prependIcon: 'mdi-calendar-today',
        required: true
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

    beforeMount () {
      this.setPage({
        title: 'New Team',
        headline: 'New Team'
      })
    }

    async submitForm () {
      const formData = new FormData()

      for (let k in this.team) {
        formData.append(`team[${k}]`, this.team[k])
      }

      const { data } = await this.createTeam(formData)

      this.$router.push({
        name: 'teams-teamId',
        params: {
          teamId: data.id
        }
      })
    }
  }
</script>
