<template lang="pug">
  v-dialog(
    v-model="dialog"
    persistent
    scrollable
    :max-width="fullWidth ? '' : '500px'"
  )
    template(#activator="{ on }")
      slot(name="activator" :on="on")
    v-form(
      ref="form"
      v-model="valid"
      style="width:100%"
      @submit.prevent="submitForm"
    )
      v-card
        v-toolbar(:class="formColor" dense)
          slot(name="header")
            v-toolbar-title
              v-icon(left) {{ titleIcon }}
              | {{ title }}
        v-divider
        v-card-text(:key="key")
          v-row(dense)
            slot(name="form")
        v-alert(
          v-model="formError"
          type="error"
          dismissible
          tile
        ) {{ errorMessage }}
        v-divider
        v-card-actions
          v-spacer
          v-btn(
            color="tertiary"
            text
            large
            @click="dialog = false"
          ) Cancel
          |&nbsp;
          slot(name="additional-actions")
          |&nbsp;
          v-btn(
            type="submit"
            :disabled="!valid"
            :color="buttonColor"
            text
            large
            :loading="loading"
            @click="loading = true"
          ) Save
</template>

<script>
  export default {
    name: 'DialogForm',
    props: {
      value: {
        type: Boolean,
        required: true
      },
      submit: {
        type: Function,
        required: true
      },
      title: {
        type: String,
        default: ''
      },
      titleIcon: {
        type: String,
        default: ''
      },
      color: {
        type: String,
        default: ''
      },
      fullWidth: Boolean
    },
    data: () => ({
      dialog: null,
      key: 0,
      valid: false,
      loading: false,
      errorMessage: '',
      formError: false
    }),
    computed: {
      buttonColor () {
        return this.color ? this.color + ' darken-2' : 'primary'
      },
      formColor () {
        return this.color ? this.color + ' accent-2' : null
      }
    },
    watch: {
      dialog (val) {
        this.$emit('input', val)

        if (!val && this.$refs.form) {
          this.resetForm()
        }
      }
    },
    mounted () {
      this.dialog = this.value
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
            this.dialog = false
            this.submitCb && this.submitCb()
          } catch (e) {
            console.log(e)
            console.log(e.message)
            this.errorMessage = e.message
            this.formError = true
          } finally {
            this.loading = false
          }
        }
      }
    }
  }
</script>
