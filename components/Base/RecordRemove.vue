<script>
  import { ref, toRef, useRouter, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'RecordRemove',
    props: {
      record: { type: Object, required: true },
      store: { type: String, required: true },
      redirect: { type: [String, Object], default: null },
      label: { type: String, default: null }
    },
    setup (props) {
      const dialog = ref(false)
      const loading = ref(false)
      const error = ref(false)
      const errorMessage = ref('')
      const record = toRef(props, 'record')
      const router = useRouter()
      const store = useStore()
      return {
        dialog,
        loading,
        error,
        errorMessage,
        remove: async () => {
          try {
            loading.value = true

            await Promise.all([
              store.dispatch(`${props.store}/remove`, record.value.id),
              () => { props.redirect && router.push(props.redirect) }
            ])

            dialog.value = false
          } catch (e) {
            errorMessage.value = e.message
            error.value = true
          } finally {
            loading.value = false
          }
        }
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
      <slot
        name="activator"
        :on="on"
      >
        <tooltip-button
          icon="mdi-delete"
          dark
          :label="`Remove ${label}`"
          :on="on"
        />
      </slot>
    </template>
    <v-card>
      <v-card-title>
        <v-toolbar-title>
          <v-icon left>mdi-alert</v-icon>
          Confirm Action
        </v-toolbar-title>
      </v-card-title>
      <v-card-text class="pt-4 pb-0">
        Remove {{ label }}?
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
          color="red"
          :loading="loading"
          @click="remove"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
