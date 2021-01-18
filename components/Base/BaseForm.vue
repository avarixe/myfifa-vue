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

<script>
  export default {
    name: 'BaseForm',
    props: {
      submit: { type: Function, required: true },
      resetAfterSubmit: { type: Boolean, default: true }
    },
    data: () => ({
      key: 0,
      error: false,
      errorMessage: '',
      loading: false,
      valid: false
    }),
    watch: {
      value (value) {
        !value && this.resetForm()
      }
    },
    methods: {
      async resetForm () {
        this.key++
        this.$refs.form.reset()
      },
      async submitForm () {
        if (this.$refs.form.validate()) {
          try {
            this.loading = true
            await this.submit()
            this.$emit('success')
            this.resetAfterSubmit && this.resetForm()
          } catch ({ response }) {
            if (response) {
              const { data: { errors } } = response
              this.errorMessage = errors[0]
            } else {
              this.errorMessage = 'API is not enabled.'
            }
            this.error = true
          } finally {
            this.loading = false
          }
        }
      }
    }
  }
</script>
