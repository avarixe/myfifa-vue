<template>
  <v-dialog
    v-model="dialog"
    :persistent="loading"
    max-width="500px"
  >
    <template #activator="{ on }">
      <tooltip-button
        label="Release"
        icon="mdi-door-open"
        color="brown"
        :on="on"
      />
    </template>
    <v-card>
      <v-card-title class="brown">
        <v-toolbar-title>
          <v-icon left>mdi-door-open</v-icon>
          Confirm Action
        </v-toolbar-title>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-row>
          <v-col cols="12">
            Release Player: {{ player.name }}?
          </v-col>
        </v-row>
      </v-card-text>
      <v-alert
        v-model="error"
        type="error"
        dismissible
        tile
      >
        {{ errorMessage }}
      </v-alert>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          :disabled="loading"
          @click="dialog = false"
        >
          No
        </v-btn>
        <v-btn
          text
          color="brown"
          :loading="loading"
          @click="release"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'PlayerRelease',
    props: {
      player: { type: Object, required: true }
    },
    data: () => ({
      dialog: false,
      loading: false,
      error: false,
      errorMessage: ''
    }),
    methods: {
      ...mapActions('players', {
        releasePlayer: 'release'
      }),
      async release () {
        try {
          this.loading = true
          await this.releasePlayer(this.player.id)
          this.dialog = false
        } catch (e) {
          this.errorMessage = e.message
          this.error = true
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
