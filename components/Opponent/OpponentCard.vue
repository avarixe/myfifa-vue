<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-overflow
    eager
  >
    <template #activator="{ attrs, on }">
      <slot
        name="activator"
        :attrs="attrs"
        :on="on"
        :opponent="opponent"
      >
        <div
          v-ripple
          class="pa-2 elevation-5 rounded-lg"
          v-bind="attrs"
          v-on="on"
        >
          <div class="opponent-label font-weight-bold">TEAM</div>
          <div class="opponent-team">{{ opponent }}</div>
        </div>
      </slot>
    </template>
    <v-card>
      <v-card-title class="text-subtitle-1 pa-2">
        <span class="mr-2">vs</span>
        <span class="font-weight-light">{{ opponent }}</span>
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
          <v-icon>mdi-soccer</v-icon>
        </v-tab>
        <v-tab>
          <v-icon>mdi-book</v-icon>
        </v-tab>

        <v-tab-item>
          <opponent-goal-form
            :match="match"
            @submitted="menu = false"
          />
        </v-tab-item>
        <v-tab-item>
          <opponent-booking-form
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
    name: 'OpponentCard',
    props: {
      match: { type: Object, required: true }
    },
    data: () => ({
      menu: false
    }),
    computed: {
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      },
      opponent () {
        return this.team.name === this.match.home
          ? this.match.away
          : this.match.home
      }
    }
  }
</script>

<style scoped>
  .opponent-label {
    margin-left: -100%;
    margin-right: -100%;
    text-align: center;
  }

  .opponent-team {
    font-size: 0.8em;
    line-height: 1;
  }
</style>
