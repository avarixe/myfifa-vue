<template lang="pug">
  div
    .font-weight-bold
      inline-select(
        :item="cap"
        attribute="pos"
        :label="`${cap.name} Position`"
        :options="positions"
        :readonly="readonly"
        @change="setPosition($event)"
      )
    .font-weight-thin
      inline-select(
        v-if="!readonly"
        :item="cap"
        attribute="player_id"
        :label="`${cap.pos} Player`"
        :options="players"
        option-avatar="pos"
        option-text="name"
        option-value="id"
        :display="cap.name"
        @change="setPlayer($event)"
      )
      v-dialog(v-else width="500")
        template(#activator="{ on }")
          a.black--text(v-on="on") {{ cap.name }}
        player-card(:player-id="cap.player_id")
    cap-events(:cap="cap" :match="match")
</template>

<script>
  import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator'
  import { activePlayers } from '@/models/Player'
  import { positions } from '@/models/Match'
  import { InlineSelect } from '@/helpers'
  import CapEvents from './Events'
  import PlayerCard from '@/components/Player/Card'

  const caps = namespace('caps')
  const broadcaster = namespace('broadcaster')

  @Component({
    components: {
      CapEvents,
      InlineSelect,
      PlayerCard
    }
  })
  export default class CapView extends Vue {
    @caps.Action('UPDATE') updateCap
    @broadcaster.Mutation('ANNOUNCE') announce
    @Prop({ type: Object, required: true }) cap
    @Prop({ type: Object, required: true }) match
    @Prop(Boolean) readonly

    get positions () {
      return Object.keys(positions)
    }

    get players () {
      return activePlayers(parseInt(this.$route.params.teamId))
    }

    async updateCapAttribute (key, value) {
      try {
        await this.updateCap({
          id: this.cap.id,
          [key]: value
        })
      } catch (e) {
        this.announce({
          message: e.message,
          color: 'red'
        })
      }
    }

    async setPosition (position) {
      await this.updateCapAttribute('pos', position)
    }

    async setPlayer (playerId) {
      await this.updateCapAttribute('player_id', playerId)
    }
  }
</script>
