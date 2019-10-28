<template>
  <v-list-item>
    <v-list-item-action class="font-weight-bold">
      <inline-select
        :item="cap"
        attribute="pos"
        input-type="select"
        :label="`${cap.name} Position`"
        :options="positions"
        :readonly="readonly"
        @change="setPosition($event)"
      />
    </v-list-item-action>

    <span
      v-if="!readonly"
      class="font-weight-thin body-2 mr-4"
      v-text="cap.name"
    />
    <v-dialog
      v-else
      width="500"
    >
      <template #activator="{ on }">
        <a
          class="font-weight-thin body-2 black--text mr-4"
          v-on="on"
          v-text="cap.name"
        />
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
  import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator'
  import { positions } from '@/models/Match'
  import { InlineSelect } from '@/helpers'
  import CapEvents from './Events'
  import PlayerCard from '@/components/Player/Card'

  const caps = namespace('caps')

  @Component({
    components: {
      CapEvents,
      InlineSelect,
      PlayerCard
    }
  })
  export default class CapSubView extends Vue {
    @caps.Action('UPDATE') updateCap
    @Prop({ type: Object, required: true }) cap
    @Prop({ type: Object, required: true }) match
    @Prop(Boolean) readonly

    get positions () {
      return Object.keys(positions)
    }

    setPosition (position) {
      this.updateCap({
        ...this.cap,
        pos: position
      })
    }
  }
</script>
