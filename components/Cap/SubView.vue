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
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { positions } from '@/models/Match'
  import { InlineField } from '@/helpers'
  import CapEvents from './Events'

  @Component({
    components: {
      CapEvents,
      InlineField
    }
  })
  export default class CapSubView extends Vue {
    @Prop({ type: Object, required: true }) cap
    @Prop({ type: Object, required: true }) match
    @Prop(Boolean) readonly

    get positions () {
      return Object.keys(positions)
    }

    setPosition (position) {
      this.$store.dispatch('caps/UPDATE', {
        ...this.cap,
        pos: position
      })
    }

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
</script>
