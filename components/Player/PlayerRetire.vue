<template>
  <v-dialog
    v-model="dialog"
    :persistent="loading"
    max-width="500px"
  >
    <template #activator="{ on }">
      <tooltip-button
        label="Retire"
        icon="mdi-human-greeting"
        color="purple"
        :on="on"
      />
    </template>
    <v-card>
      <v-card-title class="purple white--text">
        <v-toolbar-title>
          <v-icon
            dark
            left
          >
            mdi-human-greeting
          </v-icon>
          Confirm Action
        </v-toolbar-title>
      </v-card-title>
      <v-card-text class="pt-4 pb-0">
        {{ player.name }} is Retiring End of Season?
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
          color="purple"
          :loading="loading"
          @click="retire"
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
    name: 'PlayerRetire',
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
        retirePlayer: 'retire'
      }),
      async retire () {
        try {
          this.loading = true
          await this.retirePlayer(this.player.id)
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
