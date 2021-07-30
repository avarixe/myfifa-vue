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
    <base-form
      :submit="submit"
      @success="dialog = false"
    >
      <template #default="{ error, errorMessage, loading, valid }">
        <v-card>
          <v-toolbar dense>
            <slot name="header">
              <v-toolbar-title>
                <v-icon left>{{ titleIcon }}</v-icon>
                {{ title }}
              </v-toolbar-title>
            </slot>
          </v-toolbar>
          <v-divider />
          <v-card-text>
            <v-container>
              <v-row dense>
                <slot name="form" />
              </v-row>
            </v-container>
          </v-card-text>
          <v-alert
            v-model="error"
            type="error"
            dismissible
            tile
          >
            {{ errorMessage }}
          </v-alert>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              large
              :disabled="loading"
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <slot name="additional-actions" />
            <v-btn
              type="submit"
              :disabled="!valid"
              color="primary"
              text
              large
              :loading="loading"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </base-form>
  </v-dialog>
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
      fullWidth: { type: Boolean, default: false }
    },
    data: () => ({
      dialog: null
    }),
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
