<template>
  <v-dialog
    v-model="dialog"
    :persistent="loading"
    max-width="500px"
  >
    <template #activator="{ on }">
      <tooltip-button
        label="Release"
        icon="mdi-text-box-remove"
        color="brown"
        :on="on"
      />
    </template>
    <v-card>
      <v-card-title>
        <v-toolbar-title>
          <v-icon left>mdi-text-box-remove</v-icon>
          Confirm Action
        </v-toolbar-title>
      </v-card-title>
      <v-card-text class="pt-4 pb-0">
        Release Player: {{ player.name }}?
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
