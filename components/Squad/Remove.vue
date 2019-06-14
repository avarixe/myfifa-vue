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
      Remove
    </v-tooltip>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove Squad: {{ squad.name }}?
      <v-btn
        dark
        text
        @click="$store.dispatch('squads/REMOVE', squad.id)"
      >Yes</v-btn>
      <v-btn
        dark
        text
        @click.stop="snackbar = false"
      >No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    props: {
      squad: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      snackbar: false
    })
  }
</script>
