<template>
  <div>
    <div class="font-weight-bold">
      <inline-field
        :item="cap"
        attribute="pos"
        input-type="select"
        :label="`${cap.name} Position`"
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
        :label="`${cap.pos} Player`"
        :options="players"
        option-avatar="pos"
        option-text="name"
        option-value="id"
        :display="cap.name"
        @close="setPlayer($event)"
      />

      <v-dialog
        v-else
        width="500"
      >
        <template #activator="{ on }">
          <a
            v-on="on"
            class="black--text"
          >
            <badged-link
              :text="cap.name"
              :hint="`View Player ${cap.name}`"
            />
          </a>
        </template>

        <player-card :player-id="cap.player_id" />
      </v-dialog>
    </div>

    <cap-events
      :cap="cap"
      :match="match"
    />
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import Player, { activePlayers } from '@/models/Player'
  import { positions } from '@/models/Match'
  import { BadgedLink, InlineField } from '@/helpers'
  import CapEvents from './Events'
  import PlayerCard from '@/components/Player/Card'

  @Component({
    components: {
      CapEvents,
      BadgedLink,
      InlineField,
      PlayerCard
    }
  })
  export default class CapView extends Vue {
    @Prop({ type: Object, required: true }) cap
    @Prop({ type: Object, required: true }) match
    @Prop(Boolean) readonly

    get positions () {
      return Object.keys(positions)
    }

    get players () {
      return activePlayers(parseInt(this.$route.params.teamId))
    }

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
    }

    async setPosition (position) {
      await this.updateCap('pos', position)
    }

    async setPlayer (playerId) {
      await this.updateCap('player_id', playerId)
    }

    playerName (id) {
      return Player.find(id).name
    }
  }
</script>
