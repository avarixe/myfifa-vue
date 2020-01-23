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
    div
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
          a(style="color: inherit" v-on="on") {{ cap.name }}
        player-card(:player-id="cap.player_id")
    cap-events(:cap="cap" :match="match")
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { activePlayers } from '@/models/Player'
  import { positions } from '@/models/Match'
  import CapEvents from './Events'
  import PlayerCard from '@/components/Player/Card'

  export default {
    name: 'CapView',
    components: {
      CapEvents,
      PlayerCard
    },
    props: {
      cap: {
        type: Object,
        required: true
      },
      match: {
        type: Object,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      positions () {
        return Object.keys(positions)
      },
      players () {
        return activePlayers(parseInt(this.$route.params.teamId))
      }
    },
    methods: {
      ...mapMutations('broadcaster', {
        announce: 'ANNOUNCE'
      }),
      ...mapActions('caps', {
        updateCap: 'UPDATE'
      }),
      async setPosition (position) {
        await this.updateCapAttribute('pos', position)
      },
      async setPlayer (playerId) {
        await this.updateCapAttribute('player_id', playerId)
      },
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
    }
  }
</script>
