<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-overflow
  >
    <template #activator="{ attrs, on }">
      <div
        v-ripple
        class="cap pa-2 elevation-5"
        v-bind="attrs"
        v-on="on"
      >
        <div class="player-pos font-weight-bold">{{ cap.pos }}</div>
        <div class="player-name">
          <span class="hidden-sm-and-down">{{ cap.name }}</span>
          <span class="hidden-md-and-up">{{ identifier }}</span>
        </div>
        <cap-events
          :cap="cap"
          :match="match"
        />
      </div>
    </template>
    <v-card>
      <v-card-title class="text-subtitle-1 pa-2">
        <span class="mr-2">{{ cap.pos }}</span>
        <span class="font-weight-light">{{ cap.name }}</span>
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
          <cap-editor
            :cap="cap"
            @submitted="menu = false"
          />
        </v-tab-item>
        <v-tab-item>
          <cap-goal-form
            :cap="cap"
            :match="match"
            @submitted="menu = false"
          />
        </v-tab-item>
        <v-tab-item>
          <cap-substitution-form
            :cap="cap"
            :match="match"
            @submitted="menu = false"
          />
        </v-tab-item>
        <v-tab-item>
          <cap-booking-form
            :cap="cap"
            :match="match"
            @submitted="menu = false"
          />
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-menu>
</template>

<script>
  import { Player } from '@/models'

  export default {
    name: 'CapCard',
    props: {
      cap: { type: Object, required: true },
      match: { type: Object, required: true }
    },
    data: () => ({
      menu: false
    }),
    computed: {
      player () {
        return Player.find(this.cap.player_id)
      },
      abbreviatedName () {
        return this.cap.name.split(/\s+/).map(term => term[0]).join('')
      },
      identifier () {
        return this.player && this.player.kit_no
          ? `${this.abbreviatedName}${this.player.kit_no}`
          : this.abbreviatedName
      }
    }
  }
</script>

<style scoped lang="scss">
  .cap {
    line-height: 1.5;
    border-radius: 3px;

    .player-pos {
      margin-left: -100%;
      margin-right: -100%;
      text-align: center;
    }

    .player-name {
      font-size: 0.8em;
      line-height: 1;

      .hidden-md-and-up {
        margin-left: -100%;
        margin-right: -100%;
        text-align: center;
      }
    }
  }
</style>
