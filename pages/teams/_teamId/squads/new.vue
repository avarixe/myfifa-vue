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
  import { Team } from '@/models'
  import { positions } from '@/models/Match'
  import { activePlayers } from '@/models/Player'
  import { DynamicFields } from '@/helpers'

  const app = namespace('app')
  const squads = namespace('squads')

  @Component({
    middleware: ['authenticated'],
    components: {
      DynamicFields
    },
    transition: 'fade-transition'
  })
  export default class NewSquadPage extends Vue {
    @app.Mutation('SET_PAGE') setPage
    @squads.Action('CREATE') createSquad

    valid = false
    loading = false
    errorMessage = ''
    formError = false
    squad = {
      name: '',
      squad_players_attributes: new Array(11).fill().map(x => ({
        player_id: null,
        pos: null
      }))
    }

    async fetch ({ store, params }) {
      await store.dispatch('players/FETCH', { teamId: params.teamId })
    }

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get positions () {
      return Object.keys(positions)
    }

    get players () {
      return activePlayers(this.team.id)
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
          type: 'player',
          object: this.squad.squad_players_attributes[i],
          attribute: 'player_id',
          prependIcon: 'mdi-account',
          players: this.players,
          itemValue: 'id',
          required: true,
          hideDetails: true
        })
      }

      return fields
    }

    beforeMount () {
      this.setPage({
        title: `${this.team.title} - New Squad`,
        overline: this.team.title,
        headline: 'New Squad'
      })
    }

    async submitForm () {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.createSquad({
            teamId: this.team.id,
            squad: this.squad
          })
        } catch (e) {
          this.errorMessage = e.message
          this.formError = true
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
