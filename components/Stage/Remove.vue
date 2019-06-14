<template>
  <div class="d-inline-block">
    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          @click="snackbar = true"
          icon
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      Remove {{ stage.name }}
    </v-tooltip>

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
