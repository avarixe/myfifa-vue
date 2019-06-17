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
      :color="color"
      :min="min"
      :max="max"
      @input="$refs.menu.save(date)"
    />
  </v-menu>
</template>

<script>
  import { Vue, Component, Watch } from 'vue-property-decorator'

  @Component({
    props: {
      value: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      min: String,
      max: String,
      color: String,
      prependIcon: String,
      rules: Array
    }
  })
  export default class VDateField extends Vue {
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
  }
</script>
