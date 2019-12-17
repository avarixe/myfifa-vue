<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <player-form />
      </v-col>
    </v-row>
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
  import { Team } from '@/models'
  import { positions } from '@/models/Player'
  import { DynamicFields } from '@/helpers'
  import PlayerForm from '@/components/Player/Form'

  const app = namespace('app')
  const players = namespace('players')

  @Component({
    middleware: ['authenticated'],
    components: {
      DynamicFields,
      PlayerForm
    },
    transition: 'fade-transition'
  })
  export default class NewPlayerPage extends Vue {
    @app.Mutation('SET_PAGE') setPage
    @players.Action('CREATE') createPlayer

    valid = false
    loading = false
    errorMessage = ''
    formError = false
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

    get team () {
      return Team.find(this.$route.params.teamId)
    }

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
          hideDetails: true
        }
      ]
    }

    beforeMount () {
      this.setPage({
        title: `${this.team.title} - New Player`,
        overline: this.team.title,
        headline: 'New Player'
      })
    }

    async submitForm () {
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
</script>
