<template>
  <div>
    <div class="font-weight-bold">
      <inline-field
        :item="cap"
        attribute="pos"
        input-type="select"
        label="Position"
        :options="positions"
        @close="setPosition($event)"
        :readonly="readonly"
      />
    </div>
    <div class="font-weight-thin">
      <inline-field
        v-if="!readonly"
        :item="cap"
        attribute="player_id"
        input-type="select"
        label="Player"
        :options="players"
        option-avatar="pos"
        option-text="name"
        option-value="id"
        :display="cap.name"
        @close="setPlayer($event)"
      />

      <a
        v-else
        class="black--text"
        @click="goToPlayer"
      >{{ cap.name }}</a>
    </div>

    <cap-events
      :cap="cap"
      :match="match"
    />
  </div>
</template>

<script>
  import Player, { activePlayers } from '@/models/Player'
  import { positions } from '@/models/Match'
  import { InlineField } from '@/helpers'
  import CapEvents from './Events'

  export default {
    components: {
      CapEvents,
      InlineField
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
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
      positions: () => positions,
      players () {
        return activePlayers(parseInt(this.$route.params.teamId))
      }
    },
    methods: {
      async updateCap (key, value) {
        try {
          await this.$store.dispatch('caps/UPDATE', {
            id: this.cap.id,
            [key]: value
          })
        } catch (e) {
          this.$store.commit('broadcaster/ANNOUNCE', {
            message: e.message,
            color: 'red'
          })
        }
      },
      async setPosition (position) {
        await this.updateCap('pos', position)
      },
      async setPlayer (playerId) {
        await this.updateCap('player_id', playerId)
      },
      goToPlayer () {
        this.$router.push({
          name: 'teams-teamId-players-playerId',
          params: {
            teamId: this.match.team_id,
            playerId: this.cap.player_id
          }
        })
      },
      playerName (id) {
        return Player.find(id).name
      }
    }
  }
</script>
