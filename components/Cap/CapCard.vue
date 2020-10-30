<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-overflow
  >
    <template #activator="{ attrs, on }">
      <div
        v-ripple
        class="cap pa-2 elevation-5 d-inline-block"
        v-bind="attrs"
        v-on="on"
      >
        <div class="font-weight-bold">{{ cap.pos }}</div>
        <div class="player-name">{{ cap.name }}</div>
        <cap-events
          :cap="cap"
          :match="match"
        />
      </div>
    </template>
    <v-card>
      <v-card-title class="text-subtitle-1 pa-2">
        <span class="mr-2">{{ cap.pos }}</span>
        <span class="font-weight-light">{{ player.name }}</span>
        <v-spacer />
        <v-btn
          icon
          class="ml-1"
          @click="menu = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-tabs vertical>
        <v-tab>
          <v-icon>mdi-account</v-icon>
        </v-tab>
        <v-tab>
          <v-icon>mdi-soccer</v-icon>
        </v-tab>
        <v-tab>
          <v-icon>mdi-repeat</v-icon>
        </v-tab>
        <v-tab>
          <v-icon>mdi-book</v-icon>
        </v-tab>

        <v-tab-item>
          <cap-editor :cap="cap" />
        </v-tab-item>
        <v-tab-item>
          <cap-goal-form
            :cap="cap"
            :match="match"
          />
        </v-tab-item>
        <v-tab-item>
          <cap-substitution-form
            :cap="cap"
            :match="match"
          />
        </v-tab-item>
        <v-tab-item>
          <cap-booking-form
            :cap="cap"
            :match="match"
          />
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-menu>
</template>

<script>
  import { Player, Team } from '@/models'

  export default {
    name: 'CapView',
    props: {
      cap: { type: Object, required: true },
      match: { type: Object, required: true }
    },
    data: () => ({
      menu: false
    }),
    computed: {
      team () {
        return Team.find(this.$routes.params.teamId)
      },
      player () {
        return Player.find(this.cap.player_id)
      }
    }
  }
</script>

<style scoped lang="scss">
  .cap {
    line-height: 1.5;
    border-radius: 3px;

    .player-name {
      font-size: 0.8em;
      line-height: 1;
    }
  }
</style>
