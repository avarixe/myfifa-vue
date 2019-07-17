<template>
  <v-menu
    v-model="menu"
    ref="menu"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    full-width
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        v-model="date"
        v-on="on"
        :label="label"
        :prepend-icon="prependIcon"
        :rules="rules"
        readonly
      />
    </template>
    <v-date-picker
      v-model="date"
      ref="picker"
      :color="color"
      :min="min"
      :max="max"
      @input="$refs.menu.save(date)"
    />
  </v-menu>
</template>

<script>
  import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'

  @Component
  export default class VDateField extends Vue {
    @Prop(String) value
    @Prop({ type: String, required: true }) label
    @Prop(String) min
    @Prop(String) max
    @Prop(String) color
    @Prop(String) prependIcon
    @Prop(Array) rules
    @Prop(Boolean) startWithYear

    menu = false
    date = null

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
