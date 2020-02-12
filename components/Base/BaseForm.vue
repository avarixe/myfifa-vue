<template lang="pug">
  v-form(
    ref="form"
    :key="key"
    :value="valid"
    @input="$emit('update:valid', $event)"
    @submit.prevent="submitForm"
  )
    slot(name="form")
</template>

<script>
  export default {
    name: 'BaseForm',
    props: {
      submit: { type: Function, required: true },
      submitting: { type: Boolean, default: false },
      valid: { type: Boolean, default: false },
      value: { type: Boolean, default: false }
    },
    data: () => ({
      key: 0
    }),
    watch: {
      value (value) {
        !value && this.resetForm()
      },
      submitting (value) {
        value && this.submitForm()
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
            await this.submit()
            this.$emit('success')
          } catch (e) {
            console.log(e)
            console.log(e.message)
            this.$emit('error', e.message)
          } finally {
            this.$emit('update:submitting', false)
          }
        }
      }
    }
  }
</script>
