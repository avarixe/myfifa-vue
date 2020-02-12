<template lang="pug">
  v-dialog(
    v-model="dialog"
    persistent
    scrollable
    :max-width="fullWidth ? '' : '500px'"
  )
    template(#activator="{ on }")
      slot(name="activator" :on="on")
    v-card
      v-toolbar(:class="formColor" dense)
        slot(name="header")
          v-toolbar-title
            v-icon(left) {{ titleIcon }}
            | {{ title }}
      v-divider
      v-card-text(:key="key")
        v-row(dense)
          base-form(
            v-model="dialog"
            :submit="submit"
            :submitting.sync="loading"
            :valid.sync="valid"
            @success="dialog = false"
            @error="errorMessage = $event"
          )
            template(#form)
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
  import BaseForm from './BaseForm'

  export default {
    name: 'DialogForm',
    components: {
      BaseForm
    },
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
      },
      errorMessage (val) {
        if (val.length > 0) {
          this.formError = true
        }
      }
    },
    mounted () {
      this.dialog = this.value
    }
  }
</script>
