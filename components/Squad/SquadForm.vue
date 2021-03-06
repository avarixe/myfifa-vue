<template>
  <dialog-form
    v-model="dialog"
    title="Edit Squad"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="squad.name"
          label="Name"
          prepend-icon="mdi-clipboard-text"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <template v-for="(squadPlayer, i) in squad.squad_players_attributes">
        <v-col
          :key="`pos${i}`"
          cols="4"
        >
          <v-select
            v-model="squadPlayer.pos"
            label="Position"
            prepend-icon="mdi-run"
            :items="positions"
            :rules="rulesFor.pos"
            hide-details
          />
        </v-col>
        <v-col
          :key="`player${i}`"
          cols="8"
        >
          <player-select
            v-model="squadPlayer.player_id"
            :players="activePlayers"
            item-value="id"
            label="Player"
            required
            hide-details
          />
        </v-col>
      </template>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { ActivePlayerSelectable, DialogFormable, TeamAccessible } from '@/mixins'
  import { matchPositions } from '@/constants'
  import { isRequired } from '@/functions'

  export default {
    name: 'SquadForm',
    mixins: [
      ActivePlayerSelectable,
      DialogFormable,
      TeamAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      valid: false,
      loadingPlayers: false,
      squad: {
        name: '',
        squad_players_attributes: new Array(11).fill().map(x => ({
          player_id: null,
          pos: null
        }))
      },
      rulesFor: {
        name: [isRequired('Name')],
        pos: [isRequired('Position')]
      }
    }),
    computed: {
      title () {
        return this.record ? 'Edit Squad' : 'New Squad'
      },
      positions () {
        return Object.keys(matchPositions)
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.squad = pick(this.record, [
            'id',
            'name'
          ])
          this.squad.squad_players_attributes = this.record.squad_players
            .map(squadPlayer => ({
              id: squadPlayer.id,
              player_id: squadPlayer.player_id,
              pos: squadPlayer.pos
            }))
        }

        if (this.activePlayers.length === 0) {
          this.loadPlayers()
        }
      }
    },
    methods: {
      ...mapActions({
        fetchPlayers: 'players/fetch',
        createSquad: 'squads/create',
        updateSquad: 'squads/update'
      }),
      async loadPlayers () {
        try {
          this.loadingPlayers = true
          await this.fetchPlayers({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loadingPlayers = false
        }
      },
      async submit () {
        if (this.record) {
          await this.updateSquad(this.squad)
        } else {
          await this.createSquad({
            teamId: this.team.id,
            squad: this.squad
          })
        }
      }
    }
  }
</script>
