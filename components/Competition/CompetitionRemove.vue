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
      Remove {{ seasonLabel(competition.season) }} {{ competition.name }}?
      <v-btn dark flat @click="remove(match.id)">Yes</v-btn>
      <v-btn dark flat @click.stop="snackbar = false">No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [ TeamAccessible ],
    props: {
      competition: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        snackbar: false
      }
    },
    methods: mapActions('competition', [
      'remove'
    ])
  }
</script>
