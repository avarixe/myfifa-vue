<template>
  <dialog-form
    v-model="dialog"
    title="Add Cap"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Add Player"
          icon="mdi-plus-circle-outline"
          :on="on"
        />
      </slot>
    </template>

    <template #form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="cap.pos"
              :items="positions"
              :rules="$_validate('Position', ['required'])"
              label="Position"
              prepend-icon="mdi-run"
            />
          </v-col>
          <v-col cols="12">
            <player-select
              v-model="cap.player_id"
              :players="players"
              item-value="id"
              :rules="$_validate('Player', ['required'])"
              :disabled="cap.start > 0"
              label="Player"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { positions } from '@/models/Match'
  import { activePlayers } from '@/models/Player'
  import { PlayerSelect, TooltipButton } from '@/helpers'
  import { DialogFormable } from '@/mixins'

  @Component({
    components: {
      PlayerSelect,
      TooltipButton
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
