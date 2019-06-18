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
              v-model="squad.name"
              :rules="$_validate('Name', ['required'])"
              label="Name"
              prepend-icon="mdi-clipboard-text"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-flex>
        </v-layout>

        <v-layout
          v-for="(position, i) in squad.positions_list"
          :key="i"
          row
          wrap
        >
          <v-flex xs4>
            <v-select
              v-model="squad.positions_list[i]"
              :items="positions"
              label="Position"
              prepend-icon="mdi-run"
              hide-details
            />
          </v-flex>

          <v-flex xs8>
            <player-select
              v-model="squad.players_list[i]"
              :players="players"
              item-value="id"
              label="Player"
              hide-details
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
      players_list: new Array(11),
      positions_list: new Array(11)
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
        this.squad.positions_list = [...this.squadData.positions_list]
        this.squad.players_list = this.squadData.players_list
          .map(id => parseInt(id))
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
