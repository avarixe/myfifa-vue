<template>
  <div class="d-inline-block" @click.stop="snackbar = true">
    <slot>
      <v-tooltip bottom color="black">
        <v-btn icon slot="activator">
          <v-icon color="black">mdi-minus-circle</v-icon>
        </v-btn>
        Remove
      </v-tooltip>
    </slot>
    <v-snackbar
      v-model="snackbar"
      color="black">
      Remove {{ stage.name }}?
      <v-btn dark flat @click="$store.dispatch('stage/remove', stage.id)">Yes</v-btn>
      <v-btn dark flat @click.stop="snackbar = false">No</v-btn>
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
