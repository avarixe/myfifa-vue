<template>
  <div>
    <div class="font-weight-bold">
      <cap-select
        :disabled="readonly"
        :value="cap.pos"
        :options="positions"
        @change="setPosition($event)"
      />
    </div>
    <div class="font-weight-thin">
      <cap-select
        v-if="!readonly"
        :value="cap.name"
        :options="players"
        @change="setPlayer($event)"
      >
        <template #option="{ option: player }">
          <v-list-item-action>
            <v-list-item-action-text>
              {{ player.pos }}
            </v-list-item-action-text>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ player.name }}</v-list-item-title>
          </v-list-item-content>
        </template>
      </cap-select>

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
  import { mapState } from 'vuex'
  import { activePlayers } from '@/models/Player'
  import CapEvents from './Cap/CapEvents'
  import CapSelect from './Cap/CapSelect'

  export default {
    components: {
      CapEvents,
      CapSelect
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
      ...mapState('matches', [
        'positions'
      ]),
      players () {
        return activePlayers(parseInt(this.$route.params.teamId))
      }
    },
    methods: {
      async updateCap (key, value) {
        try {
          await this.$store.dispatch('caps/UPDATE', {
            ...this.cap,
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
      async setPlayer (player) {
        await this.updateCap('player_id', player.id)
      },
      goToPlayer () {
        this.$router.push({
          name: 'teams-teamId-players-playerId',
          params: {
            teamId: this.match.team_id,
            playerId: this.cap.player_id
          }
        })
      }
    }
  }
</script>
