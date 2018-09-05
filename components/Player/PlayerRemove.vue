<template>
  <div class="d-inline-block" @click.stop="snackbar = true">
    <slot>
      <v-tooltip bottom color="black">
        <v-btn slot="activator" fab small dark>
          <v-icon>remove</v-icon>
        </v-btn>
        Remove
      </v-tooltip>
    </slot>
    <v-snackbar
      v-model="snackbar"
      color="black">
      Remove Player: {{ player.name }}?
      <v-btn dark flat @click="remove(player.id)">Yes</v-btn>
      <v-btn dark flat @click.stop="snackbar = false">No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: {
      player: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        snackbar: false
      }
    },
    methods: mapActions('player', [
      'remove'
    ])
  }
</script>
