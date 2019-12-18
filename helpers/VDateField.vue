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
        readonly
        :clearable="clearable"
        :disabled="disabled"
        v-on="on"
      />
    </template>
    <v-date-picker
      ref="picker"
      v-model="date"
      :color="color"
      :min="min"
      :max="max"
      @input="menu = false"
    />
  </v-menu>
</template>

<script>
  import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { format, parseISO } from 'date-fns'
  import { requiredRule } from '@/helpers'

  @Component
  export default class VDateField extends Vue {
    @Prop(String) value
    @Prop({ type: String, required: true }) label
    @Prop(String) min
    @Prop(String) max
    @Prop(String) color
    @Prop(String) prependIcon
    @Prop({ type: Boolean, default: false }) required
    @Prop({ type: Boolean, default: false }) startWithYear
    @Prop({ type: Boolean, default: false }) disabled
    @Prop({ type: Boolean, default: false }) clearable

    menu = false
    date = null

    get formattedDate () {
      return this.date
        ? format(parseISO(this.date), 'MMM dd, yyyy')
        : null
    }

    get rules () {
      return this.required ? [requiredRule({ label: this.label })] : []
    }

    @Watch('value', { immediate: true })
    setDate () {
      this.date = this.value
    }

    @Watch('date')
    emitValue (value) {
      this.$emit('input', value)
    }

    @Watch('menu')
    setPicker (val) {
      if (val && this.startWithYear) {
        this.$nextTick(() => {
          this.$refs.picker.activePicker = 'YEAR'
        })
      }
    }
  }
</script>
