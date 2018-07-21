<template>
  <div>
    <squad-form :initial-squad="squad" color="orange">
      <v-tooltip bottom>
        <v-btn slot="activator" icon>
          <v-icon color="orange">edit</v-icon>
        </v-btn>
        Edit
      </v-tooltip>
    </squad-form>

    <v-tooltip bottom>
      <v-btn slot="activator" icon @click="promptDeletion = true">
        <v-icon color="black">remove_circle</v-icon>
      </v-btn>
      Remove
    </v-tooltip>

    <v-snackbar
      color="black"
      v-model="promptDeletion">
      Remove Squad: {{ squad.name }}?
      <v-btn dark flat @click.native="remove(squad.id)">Yes</v-btn>
      <v-btn dark flat @click.native="promptDeletion = false">No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import SquadForm from '@/components/Squad/SquadForm'

  export default {
    components: {
      'squad-form': SquadForm
    },
    props: {
      squad: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        promptDeletion: false
      }
    },
    methods: {
      ...mapActions('squad', [
        'remove'
      ])
    }
  }
</script>
