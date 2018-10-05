<template>
  <div class="d-inline-block" @click.stop="snackbar = true">
    <slot>
      <v-tooltip bottom color="black">
        <v-btn icon slot="activator">
          <v-icon color="black">remove_circle</v-icon>
        </v-btn>
        Remove
      </v-tooltip>
    </slot>
    <v-snackbar
      v-model="snackbar"
      color="black">
      Remove Match: {{ match.home }} v {{ match.away }}?
      <v-btn dark flat @click="remove(match.id)">Yes</v-btn>
      <v-btn dark flat @click.stop="snackbar = false">No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        snackbar: false
      }
    },
    methods: mapActions('match', [
      'remove'
    ])
  }
</script>
