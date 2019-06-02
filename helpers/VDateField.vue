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
  export default {
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
    },
    data: () => ({
      menu: false,
      date: null
    }),
    watch: {
      value: {
        immediate: true,
        handler () {
          this.date = this.value
        }
      },
      date (value) {
        this.$emit('input', value)
      }
    }
  }
</script>
