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
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="squad.name"
              :rules="$_validate('Name', ['required'])"
              label="Name"
              prepend-icon="mdi-clipboard-text"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-col>
        </v-row>

        <v-row
          v-for="(squadPlayer, i) in squad.squad_players_attributes"
          :key="i"
        >
          <v-col cols="4">
            <v-select
              v-model="squadPlayer.pos"
              :items="positions"
              label="Position"
              prepend-icon="mdi-run"
              hide-details
            />
          </v-col>

          <v-col cols="8">
            <player-select
              v-model="squadPlayer.player_id"
              :players="players"
              item-value="id"
              label="Player"
              hide-details
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { positions } from '@/models/Match'
  import { activePlayers } from '@/models/Player'
  import { PlayerSelect } from '@/helpers'
  import { DialogFormable, TeamAccessible } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)

  @Component({
    components: {
      PlayerSelect
    },
    methods: mapActions('squads', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class SquadForm extends mix {
    @Prop(Object) squadData

    valid = false
    squad = {
      name: '',
      squad_players_attributes: new Array(11).fill().map(x => ({
        player_id: null,
        pos: null
      }))
    }

    get positions () {
      return Object.keys(positions)
    }

    get title () {
      return this.squad.id ? 'Edit Squad' : 'New Squad'
    }

    get players () {
      return activePlayers(this.team.id)
    }

    @Watch('dialog')
    setSquad (val) {
      this.valid = !!this.squadData
      if (this.squadData) {
        Object.assign(this.squad, this.$_pick(this.squadData, [
          'id',
          'name'
        ]))
        this.squad.squad_players_attributes = this.squadData.squad_players
          .map(squadPlayer => ({
            id: squadPlayer.id,
            player_id: squadPlayer.player_id,
            pos: squadPlayer.pos
          }))
      }
    }

    async submit () {
      if (this.squadData) {
        await this.update(this.squad)
      } else {
        await this.create({
          teamId: this.team.id,
          squad: this.squad
        })
      }
    }
  }
</script>
