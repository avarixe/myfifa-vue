<template>
  <div
    class="d-inline-block"
    @click.stop="snackbar = true"
  >
    <slot>
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            v-on="on"
            icon
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        Remove Table Row
      </v-tooltip>
    </slot>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove Table Row?
      <v-btn
        @click="$store.dispatch('tableRows/REMOVE', row.id)"
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
      row: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    })
  }
</script>
