<template lang="pug">
  v-dialog(
    v-model="dialog"
    persistent
    scrollable
    :max-width="fullWidth ? '' : '500px'"
  )
    template(#activator="{ on }")
      slot(name="activator" :on="on")
    base-form(
      :submit="submit"
      @success="dialog = false"
    )
      template(#default="{ error, errorMessage, loading, valid }")
        v-card
          v-toolbar(:class="formColor" dense)
            slot(name="header")
              v-toolbar-title
                v-icon(left) {{ titleIcon }}
                | {{ title }}
          v-divider
          v-card-text
            v-container
              v-row(dense)
                slot(name="form")
          v-alert(
            v-model="error"
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
              :disabled="loading"
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
            ) Save
</template>

<script>
  import BaseForm from './BaseForm'

  export default {
    name: 'DialogForm',
    components: {
      BaseForm
    },
    props: {
      value: { type: Boolean, required: true },
      submit: { type: Function, required: true },
      title: { type: String, default: '' },
      titleIcon: { type: String, default: '' },
      color: { type: String, default: '' },
      fullWidth: { type: Boolean, default: false }
    },
    data: () => ({
      dialog: null
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
      }
    },
    mounted () {
      this.dialog = this.value
    }
  }
</script>
