<template>
  <div class="d-inline-block">
    <squad-form :squad-data="squad" >
      <template #default="{ on: dialog }">
        <v-tooltip
          bottom
          color="orange"
        >
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...dialog, ...tooltip }"
              flat
              icon
            >
              <v-icon color="orange">mdi-pencil</v-icon>
            </v-btn>
          </template>
          Edit
        </v-tooltip>
      </template>
    </squad-form>

    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          icon
          @click="promptDeletion = true"
        >
          <v-icon color="black">mdi-minus-circle</v-icon>
        </v-btn>
      </template>
      Remove
    </v-tooltip>

    <v-snackbar
      color="black"
      v-model="promptDeletion"
    >
      Remove Squad: {{ squad.name }}?
      <v-btn
        dark
        text
        @click.native="$store.dispatch('squads/REMOVE', squad.id)"
      >Yes</v-btn>
      <v-btn
        dark
        text
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
