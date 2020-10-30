<template>
  <div class="pa-2">
    <div class="text-subtitle-2 pb-2">
      Edit Position and Player
    </div>
    <v-select
      v-model="pos"
      label="Position"
      prepend-icon="mdi-run"
      :items="positions"
      menu-props="auto"
      required
      @change="setPosition"
    />
    <player-select
      v-model="playerId"
      :players="activePlayers"
      item-value="id"
      required
      :disabled="cap.start > 0"
      @input="setPlayer"
    />
  </div>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { activePlayers } from '@/models/Player'
  import { positions } from '@/models/Match'

  export default {
    name: 'CapEditor',
    props: {
      cap: { type: Object, required: true }
    },
    data: () => ({
      pos: null,
      playerId: null
    }),
    computed: {
      positions () {
        return Object.keys(positions)
      },
      activePlayers () {
        return activePlayers(parseInt(this.$route.params.teamId))
      }
    },
    watch: {
      cap: {
        immediate: true,
        handler (cap) {
          this.pos = cap.pos
          this.playerId = cap.player_id
        }
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
          this.pos = this.cap.pos
          this.playerId = this.cap.player_id
          this.announce({
            message: e.message,
            color: 'red'
          })
        }
      }
    }
  }
</script>
