<template>
  <dialog-form
    v-model="dialog"
    title="Add Cap"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <template #form>
      <v-container>
        <v-layout wrap>
          <v-flex xs12>
            <v-select
              v-model="cap.pos"
              :items="positions"
              :rules="$_validate('Position', ['required'])"
              label="Position"
              prepend-icon="mdi-run"
            />
          </v-flex>
          <v-flex xs12>
            <player-select
              v-model="cap.player_id"
              :players="players"
              item-value="id"
              :rules="$_validate('Player', ['required'])"
              :disabled="cap.start > 0"
              label="Player"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { positions } from '@/models/Match'
  import { activePlayers } from '@/models/Player'
  import { PlayerSelect } from '@/helpers'
  import { DialogFormable } from '@/mixins'

  @Component({
    components: {
      PlayerSelect
    }
  })
  export default class CapForm extends mixins(DialogFormable) {
    @Prop({ type: Object, required: true }) match

    cap = {
      player_id: null,
      pos: ''
    }

    get positions () {
      return Object.keys(positions)
    }

    get players () {
      return activePlayers(parseInt(this.$route.params.teamId))
    }

    async submit () {
      await this.$store.dispatch('caps/CREATE', {
        matchId: this.match.id,
        cap: this.cap
      })
    }
  }
</script>
