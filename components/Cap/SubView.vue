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
    <nuxt-link
      v-else
      :to="cap.playerLink"
      class="font-weight-thin body-2 black--text mr-4"
    >
      <v-tooltip bottom>
        <template #activator="{ on }">
          <span v-on="on">
            <v-badge color="transparent">
              <template #badge>
                <v-icon>mdi-link-variant</v-icon>
              </template>
              {{ cap.name }}
            </v-badge>
          </span>
        </template>
        View Player {{ cap.name }}
      </v-tooltip>
    </nuxt-link>

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
  }
</script>
