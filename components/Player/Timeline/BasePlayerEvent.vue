<template>
  <v-timeline-item
    :icon="icon"
    :color="color"
    fill-dot
    right
  >
    <template #opposite>
      <span :class="`text-h5 font-weight-bold ${color}--text`">
        {{ title }}
      </span>
      <h4 :class="`text-h6 font-weight-light mb-3 ${color}--text`">
        <slot name="heading" />
      </h4>
    </template>
    <v-card
      dense
      flat
    >
      <v-card-title
        v-if="dense"
        class="py-0"
      >
        <div :class="`${color}--text`">
          <span class="text-h6 font-weight-bold">{{ title }}</span>
          <h4 class="text-body-2 font-weight-light mb-3">
            <slot name="heading" />
          </h4>
        </div>
      </v-card-title>
      <v-card-text class="py-0">
        <table>
          <tbody>
            <slot name="details" />
          </tbody>
        </table>
      </v-card-text>
      <v-card-actions>
        <component
          :is="`${event.type}-form`"
          :player="player"
          :record="event"
        >
          <template #default="{ on }">
            <v-btn
              text
              small
              color="orange"
              v-on="on"
            >
              Edit
            </v-btn>
          </template>
        </component>
      </v-card-actions>
    </v-card>
  </v-timeline-item>
</template>

<script>
  export default {
    name: 'BasePlayerEvent',
    props: {
      player: { type: Object, required: true },
      event: { type: Object, required: true },
      title: { type: String, required: true },
      icon: { type: String, required: true },
      color: { type: String, required: true },
      dense: { type: Boolean, default: false }
    }
  }
</script>
