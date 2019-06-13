<template>
  <v-list-item>
    <v-list-item-action class="font-weight-bold">
      <inline-field
        :item="cap"
        attribute="pos"
        input-type="select"
        label="Position"
        :options="positions"
        @close="setPosition($event)"
        :readonly="readonly"
      />
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
  import { InlineField } from '@/helpers'
  import CapEvents from './CapEvents'

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
