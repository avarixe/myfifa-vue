<template>
  <v-dialog
    v-model="dialog"
    persistent
    lazy
    :max-width="fullWidth ? '' : '500px'"
  >
    <slot
      name="activator"
      slot="activator"
    />

    <v-form
      v-model="valid"
      ref="form"
      @submit.prevent="submitForm"
    >
      <v-card>
        <v-card-title
          primary-title
          :class="formColor"
        >
          <slot
            name="header"
          >
            <div
              class="headline"
            >
              <v-icon
                left
                v-text="titleIcon"
              />
              {{ title }}
            </div>
          </slot>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <slot
            name="form"
          />
        </v-card-text>

        <v-alert
          type="error"
          v-model="formError"
          dismissible
          v-text="errorMessage"
        />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="tertiary"
            flat
            large
            @click="dialog = false"
            v-text="'Cancel'"
          />
          <v-btn
            type="submit"
            :disabled="!valid"
            :color="buttonColor"
            flat
            large
            v-text="'Save'"
          />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        required: true
      },
      submit: {
        type: Function,
        required: true
      },
      submitCb: Function,
      title: String,
      titleIcon: String,
      color: String,
      fullWidth: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        dialog: this.value,
        valid: false,
        errorMessage: ''
      }
    },
    computed: {
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      },
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
    methods: {
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
          }
        }
      }
    }
  }
</script>
