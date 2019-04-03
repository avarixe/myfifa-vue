<template>
  <div
    class="d-inline-block"
  >
    <squad-form
      :squad-data="squad"
    >
      <v-tooltip
        bottom
        color="orange"
      >
        <v-btn
          slot="activator"
          flat
          icon
        >
          <v-icon
            color="orange"
          >mdi-pencil</v-icon>
        </v-btn>
        Edit
      </v-tooltip>
    </squad-form>

    <v-tooltip
      bottom
    >
      <v-btn
        slot="activator"
        icon
        @click="promptDeletion = true"
      >
        <v-icon
          color="black"
        >mdi-minus-circle</v-icon>
      </v-btn>
      Remove
    </v-tooltip>

    <v-snackbar
      color="black"
      v-model="promptDeletion"
    >
      Remove Squad: {{ squad.name }}?
      <v-btn
        dark
        flat
        @click.native="$store.dispatch('entities/squads/REMOVE', squad.id)"
      >Yes</v-btn>
      <v-btn
        dark
        flat
        @click.native="promptDeletion = false"
      >No</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import SquadForm from './SquadForm'

  export default {
    components: {
      SquadForm
    },
    props: {
      squad: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      promptDeletion: false
    })
  }
</script>
