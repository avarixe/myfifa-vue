<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-overflow
  >
    <template #activator="{ attrs, on }">
      <slot
        name="activator"
        :attrs="attrs"
        :on="on"
        :player="player"
        :cap="cap"
      >
        <div
          v-ripple
          class="pa-2 elevation-5 rounded-lg"
          v-bind="attrs"
          v-on="on"
        >
          <div class="player-pos font-weight-bold">{{ cap.pos }}</div>
          <scroll-text
            :text="player.name"
            :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
          />
          <cap-events
            :cap="cap"
            :match="match"
          />
        </div>
      </slot>
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
        return this.$store.$db().model('Player').find(this.cap.playerId)
      }
    }
  }
</script>
