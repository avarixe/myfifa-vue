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
      <dynamic-fields :fields="fields">
        <template #field.minute>
          <player-select
            v-model="cap.player_id"
            :players="players"
            item-value="id"
            :disabled="cap.start > 0"
            label="Player"
            required
          />
        </template>
      </dynamic-fields>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, namespace } from 'nuxt-property-decorator'
  import { positions } from '@/models/Match'
  import { activePlayers } from '@/models/Player'
  import { DynamicFields, PlayerSelect, TooltipButton } from '@/helpers'
  import { DialogFormable } from '@/mixins'

  const caps = namespace('caps')

  @Component({
    components: {
      DynamicFields,
      PlayerSelect,
      TooltipButton
    }
  })
  export default class CapForm extends mixins(DialogFormable) {
    @caps.Action('CREATE') createCap
    @Prop({ type: Object, required: true }) match

    cap = {
      player_id: null,
      pos: ''
    }

    get fields () {
      return [
        {
          type: 'select',
          object: this.cap,
          attribute: 'pos',
          items: Object.keys(positions),
          label: 'Position',
          prependIcon: 'mdi-run',
          required: true
        },
        { slot: 'minute' }
      ]
    }

    get players () {
      return activePlayers(parseInt(this.$route.params.teamId))
    }

    async submit () {
      await this.createCap({
        matchId: this.match.id,
        cap: this.cap
      })
    }
  }
</script>
