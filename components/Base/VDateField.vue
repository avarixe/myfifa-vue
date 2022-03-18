<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        :value="formattedDate"
        :rules="rules"
        :label="label"
        :prepend-icon="prependIcon"
        :append-icon="prefill ? 'mdi-calendar-arrow-left' : null"
        :append-outer-icon="appendOuterIcon"
        readonly
        :clearable="clearable"
        :disabled="disabled"
        :dense="dense"
        :outlined="outlined"
        :hide-details="hideDetails"
        v-on="{ ...on, ...$listeners }"
        @click:append="date = prefill"
        @click:clear="date = null"
      />
    </template>
    <v-date-picker
      ref="picker"
      v-model="date"
      :color="color"
      :min="min"
      :max="max"
      :active-picker.sync="activePicker"
      @input="menu = false"
    />
  </v-menu>
</template>

<script>
  import { format, parseISO } from 'date-fns'
  import { isRequired } from '@/functions'

  export default {
    name: 'VDateField',
    props: {
      value: { type: String, default: null },
      label: { type: String, required: true },
      min: { type: String, default: null },
      max: { type: String, default: null },
      color: { type: String, default: null },
      prependIcon: { type: String, default: null },
      appendOuterIcon: { type: String, default: null },
      required: { type: Boolean, default: false },
      startWithYear: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      dense: { type: Boolean, default: false },
      outlined: { type: Boolean, default: false },
      hideDetails: { type: Boolean, default: false },
      clearable: { type: Boolean, default: false },
      prefill: { type: String, default: null }
    },
    data: () => ({
      menu: false,
      date: null,
      activePicker: 'DATE'
    }),
    computed: {
      formattedDate () {
        return this.date
          ? format(parseISO(this.date), 'MMM dd, yyyy')
          : null
      },
      rules () {
        return this.required ? [isRequired(this.label)] : []
      }
    },
    watch: {
      value: {
        handler () {
          this.date = this.value
        },
        immediate: true
      },
      date (value) {
        this.$emit('input', value)
      },
      menu (val) {
        if (val && this.startWithYear) {
          this.$nextTick(() => {
            this.activePicker = 'YEAR'
          })
        }
      }
    }
  }
</script>
