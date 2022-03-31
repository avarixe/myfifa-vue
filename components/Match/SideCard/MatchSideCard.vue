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
        :side-team="sideTeam"
      >
        <div
          v-ripple
          class="pa-2 elevation-5 rounded-lg"
          v-bind="attrs"
          v-on="on"
        >
          <div class="match-side-label font-weight-bold">TEAM</div>
          <div class="match-side-team">{{ sideTeam }}</div>
        </div>
      </slot>
    </template>
    <v-card>
      <v-card-title class="text-subtitle-1 pa-2">
        <small class="mr-2 text-overline">
          {{ [match.home, match.away].includes(team.name) ? 'vs' : side }}
        </small>
        <span class="font-weight-light">{{ sideTeam }}</span>
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
          <match-side-goal-form
            :match="match"
            :side="side"
            @submitted="menu = false"
          />
        </v-tab-item>
        <v-tab-item>
          <match-side-booking-form
            :match="match"
            :side="side"
            @submitted="menu = false"
          />
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-menu>
</template>

<script>
  export default {
    name: 'MatchSideCard',
    props: {
      match: { type: Object, required: true },
      side: { type: String, required: true }
    },
    data: () => ({
      menu: false
    }),
    computed: {
      team () {
        return this.$store.$db().model('Team').find(this.$route.query.teamId)
      },
      sideTeam () {
        return this.match[this.side]
      }
    }
  }
</script>

<style scoped>
  .match-side-label {
    margin-left: -100%;
    margin-right: -100%;
    text-align: center;
  }

  .match-side-team {
    font-size: 0.8em;
    line-height: 1;
  }
</style>
