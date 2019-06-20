<template>
  <v-list-item two-line>
    <v-list-item-action class="font-weight-bold">
      <inline-field
        :item="cap"
        attribute="pos"
        input-type="select"
        :label="`${cap.name} Position`"
        :options="positions"
        @close="setPosition($event)"
        :readonly="readonly"
      />
    </v-list-item-action>

    <span
      v-if="!readonly"
      class="font-weight-thin body-2 mr-4"
    >{{ cap.name }}</span>
    <v-dialog
      v-else
      width="500"
    >
      <template #activator="{ on }">
        <a
          v-on="on"
          class="font-weight-thin body-2 black--text mr-4"
        >
          <badged-link
            :text="cap.name"
            :hint="`View Player ${cap.name}`"
          />
        </a>
      </template>

      <player-card :player-id="cap.player_id" />
    </v-dialog>

    <cap-events
      :cap="cap"
      :match="match"
      class="d-inline-block"
    />

  </v-list-item>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
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
  }
</script>
