<script>
  import { ref, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'PlayerRetire',
    props: {
      player: { type: Object, required: true }
    },
    setup (props) {
      const dialog = ref(false)
      const loading = ref(false)
      const error = ref(false)
      const errorMessage = ref('')

      const store = useStore()
      const retire = async () => {
        try {
          loading.value = true
          await store.dispatch('players/retire', props.player.id)
          dialog.value = false
        } catch (e) {
          errorMessage.value = e.message
          error.value = true
        } finally {
          loading.value = false
        }
      }

      return {
        dialog,
        loading,
        error,
        errorMessage,
        retire
      }
    }
  }
</script>

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
      <v-card-title>
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
