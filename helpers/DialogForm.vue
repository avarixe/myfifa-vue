<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    :max-width="fullWidth ? '' : '500px'"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>

    <v-form
      v-model="valid"
      ref="form"
      @submit.prevent="submitForm"
      style="width:100%"
    >
      <v-card>
        <v-card-title
          primary-title
          :class="formColor"
        >
          <slot name="header">
            <div class="headline">
              <v-icon left>{{ titleIcon }}</v-icon>
              {{ title }}
            </div>
          </slot>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <slot name="form" />
        </v-card-text>

        <v-alert
          type="error"
          v-model="formError"
          dismissible
        >{{ errorMessage }}</v-alert>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="tertiary"
            text
            large
            @click="dialog = false"
          >Cancel</v-btn>

          <slot name="additional-actions" />

          <v-btn
            type="submit"
            :disabled="!valid"
            :color="buttonColor"
            text
            large
            :loading="loading"
            @click="loading = true"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
  import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'

  @Component
  export default class DialogForm extends Vue {
    @Prop({ type: Boolean, required: true }) value
    @Prop({ type: Function, required: true }) submit
    @Prop(Function) submitCb
    @Prop(String) title
    @Prop(String) titleIcon
    @Prop(String) color
    @Prop(Boolean) fullWidth

    dialog = null
    valid = false
    loading = false
    errorMessage = ''

    get formError () {
      return this.errorMessage.length > 0
    }

    set formError (val) {
      this.errMessage = val
    }

    get buttonColor () {
      return this.color ? this.color + ' darken-2' : 'primary'
    }

    get formColor () {
      return this.color ? this.color + ' accent-2' : null
    }

    mounted () {
      this.dialog = this.value
    }

    @Watch('dialog')
    emitValue (val) {
      this.$emit('input', val)
    }

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
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
