<script>
  import { ref, toRef } from '@nuxtjs/composition-api'

  export default {
    name: 'BaseForm',
    props: {
      submit: { type: Function, required: true },
      resetAfterSubmit: { type: Boolean, default: true }
    },
    setup (props, { emit }) {
      const form = ref(null)
      async function resetForm () {
        key.value++
        form.value.reset()
      }

      const key = ref(0)
      const error = ref(false)
      const errorMessage = ref('')
      const loading = ref(false)
      const resetAfterSubmit = toRef(props, 'resetAfterSubmit')
      return {
        key,
        error,
        errorMessage,
        loading,
        valid: ref(false),
        form,
        resetForm,
        submitForm: async () => {
          if (form.value.validate()) {
            try {
              loading.value = true
              error.value = false
              await props.submit()
              emit('success')
              if (resetAfterSubmit.value) {
                resetForm()
                emit('reset')
              }
            } catch (err) {
              errorMessage.value = err.message
              error.value = true
            } finally {
              loading.value = false
            }
          }
        }
      }
    }
  }
</script>

<template>
  <v-form
    ref="form"
    :key="key"
    v-model="valid"
    @submit.prevent="submitForm"
  >
    <slot
      :error="error"
      :error-message="errorMessage"
      :loading="loading"
      :valid="valid"
    />
  </v-form>
</template>
