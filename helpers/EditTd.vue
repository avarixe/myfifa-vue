<template>
  <div>
    <template v-if="readonly">
      <span :class="displayClass">{{ display }}</span>
    </template>
    <template v-else>
      <v-edit-dialog @close="$emit('close', value)">
        <span :class="displayClass">{{ display }}</span>
        <template #input>
          <v-combobox
            v-if="inputType === 'combobox'"
            v-model="value"
            :items="options"
            :rules="rules"
            :label="label"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
            autofocus
          />
          <v-text-field
            v-else
            v-model="value"
            :label="label"
            :type="inputType"
            :rules="rules"
            autofocus
          />
        </template>
      </v-edit-dialog>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      },
      attribute: {
        type: String,
        required: true
      },
      humanizer: {
        type: Function,
        default: val => val
      },
      label: String,
      options: Array,
      rules: Array,
      inputType: String,
      displayClass: String,
      readonly: Boolean
    },
    data: () => ({
      value: null
    }),
    computed: {
      display () {
        const humanizedValue = this.humanizer(this.value)
        return humanizedValue === null || humanizedValue === ''
          ? '-'
          : humanizedValue
      }
    },
    mounted () {
      this.value = this.item[this.attribute]
    }
  }
</script>
