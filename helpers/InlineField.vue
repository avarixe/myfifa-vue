<template>
  <span :class="fieldClass">
    <template v-if="edit">
      <v-combobox
        v-if="type === 'combobox'"
        :value="value"
        @change="updateValue"
        :items="items"
        :label="label"
        spellcheck="false"
        autocapitalize="words"
        autocomplete="off"
        autocorrect="off"
      />
      <v-text-field
        v-else-if="type === 'number'"
        :value.number="value"
        @input.number="updateValue"
        type="number"
        :label="label"
      />
      <v-text-field
        v-else
        :value="value"
        @input="updateValue"
        :label="label"
      />
    </template>
    <template v-else>
      {{ field }}
    </template>
  </span>
</template>

<script>
  export default {
    props: {
      value: [String, Number, Boolean],
      label: String,
      edit: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'text'
      },
      items: {
        type: Array,
        default: []
      },
      fieldClass: {
        type: String,
        default: ''
      }
    },
    methods: {
      updateValue (value) {
        this.$emit('input', value)
      }
    }
  }
</script>
