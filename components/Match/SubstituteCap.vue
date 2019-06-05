<template>
  <v-list-item>
    <v-list-item-action>
      <v-menu
        :disabled="readonly"
        max-height="200px"
        offset-y
        offset-overflow
      >
        <template #activator="{ on }">
          <span
            v-on="on"
            class="font-weight-bold"
          >{{ cap.pos }}</span>
        </template>
        <v-list>
          <v-list-item
            v-for="pos in positions"
            :key="pos"
            @click="setPosition(pos)">
            <v-list-item-title>{{ pos }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item-action>

    <v-list-item-content>
      <v-list-item-title>
        <a
          class="font-weight-thin body-2 black--text"
          @click="goToPlayer"
        >{{ cap.name }}</a>

        <cap-events
          :cap="cap"
          :match="match"
          class="d-inline-block"
        />
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  import { mapState } from 'vuex'
  import CapEvents from './Cap/CapEvents'

  export default {
    components: {
      CapEvents
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
    computed: mapState('matches', [
      'positions'
    ]),
    methods: {
      setPosition (position) {
        this.$store.dispatch('caps/UPDATE', {
          ...this.cap,
          pos: position
        })
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
