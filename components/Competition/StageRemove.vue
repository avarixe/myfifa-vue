<template>
  <div
    class="d-inline-block"
    @click.stop="snackbar = true"
  >
    <slot>
      <v-tooltip
        color="black"
        bottom
      >
        <template #activator="{ on }">
          <v-btn
            v-on="on"
            icon
          >
            <v-icon color="black">mdi-minus-circle</v-icon>
          </v-btn>
        </template>
        Remove
      </v-tooltip>
    </slot>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove {{ stage.name }}?
      <v-btn
        @click="$store.dispatch('stages/REMOVE', stage.id)"
        dark
        text
      >Yes</v-btn>
      <v-btn
        @click.stop="snackbar = false"
        dark
        text
      >No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    props: {
      stage: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    })
  }
</script>
