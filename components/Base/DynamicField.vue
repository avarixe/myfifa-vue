<template lang="pug">
  span(v-if="!field.hidden")
    //- String
    v-text-field(
      v-if="field.type === 'string'"
      :label="field.label"
      :prepend-icon="field.prependIcon"
      :prefix="field.prefix"
      :disabled="field.disabled"
      :hide-details="field.hideDetails"
      :dense="field.dense"
      :outlined="field.outlined"
      :inputmode="field.inputmode"
      :spellcheck="field.spellcheck"
      :autocapitalize="field.autocapitalize"
      :autocomplete="field.autocomplete"
      :autocorrect="field.autocorrect"
      :rules="rulesFor(field)"
      :value="fieldValue(field)"
      @input="updateField(field, $event)"
    )
    //- Select
    v-select(
      v-else-if="field.type === 'select'"
      :label="field.label"
      :prepend-icon="field.prependIcon"
      :items="field.items"
      :item-key="field.itemKey"
      :item-value="field.itemValue"
      :multiple="field.multiple"
      :chips="field.multiple"
      :deletable-chips="field.multiple"
      :hide-details="field.hideDetails"
      :dense="field.dense"
      :outlined="field.outlined"
      menu-props="auto"
      :loading="field.loading"
      :clearable="field.clearable"
      :rules="rulesFor(field)"
      :value="fieldValue(field)"
      @input="updateField(field, $event)"
    )
    //- Combobox
    v-combobox(
      v-else-if="field.type === 'combobox'"
      :label="field.label"
      :prepend-icon="field.prependIcon"
      :append-outer-icon="field.appendOuterIcon"
      :items="field.items"
      :item-key="field.itemKey"
      :item-value="field.itemValue"
      :multiple="field.multiple"
      :chips="field.multiple"
      :deletable-chips="field.multiple"
      :loading="field.loading"
      :hide-details="field.hideDetails"
      menu-props="auto, offsetY"
      :spellcheck="field.spellcheck"
      :autocapitalize="field.autocapitalize"
      :autocomplete="field.autocomplete"
      :autocorrect="field.autocorrect"
      :rules="rulesFor(field)"
      :value="fieldValue(field)"
      @input="updateField(field, $event)"
      @click:append-outer="field.clickAppendOuter && field.clickAppendOuter()"
    )
    //- Checkbox
    v-checkbox(
      v-else-if="field.type === 'checkbox'"
      :label="field.label"
      :hide-details="field.hideDetails"
      :disabled="field.disabled"
      :value="fieldValue(field)"
      @change="updateField(field, $event)"
    )
    //- Radio
    v-radio-group(
      v-else-if="field.type === 'radio'"
      row
      :hide-details="field.hideDetails"
      :value="fieldValue(field)"
      @change="updateField(field, $event)"
    )
      v-radio(
        v-for="item in field.items"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :color="item.color"
      )
    //- Date
    v-date-field(
      v-else-if="field.type === 'date'"
      :label="field.label"
      :prepend-icon="field.prependIcon"
      :required="field.required"
      :hide-details="field.hideDetails"
      :dense="field.dense"
      :outlined="field.outlined"
      :color="field.color"
      :min="field.min"
      :max="field.max"
      :start-with-year="field.startWithYear"
      :disabled="field.disabled"
      :value="fieldValue(field)"
      @input="updateField(field, $event)"
    )
    //- Money
    v-money-field(
      v-else-if="field.type === 'money'"
      :label="field.label"
      :prefix="field.prefix"
      :required="field.required"
      :hide-details="field.hideDetails"
      :dense="field.dense"
      :outlined="field.outlined"
      :value="fieldValue(field)"
      @input="updateField(field, $event)"
    )
    //- Password
    v-text-field(
      v-else-if="field.type === 'password'"
      :label="field.label"
      :type="visible ? 'text' : 'password'"
      :append-icon="`mdi-eye${visible ? '-off' : ''}`"
      :value="fieldValue(field)"
      @input="updateField(field, $event)"
      @click:append="visible = !visible"
    )
    //- File
    v-file-input(
      v-else-if="field.type === 'file'"
      :label="field.label"
      :value="fieldValue(field)"
      @change="updateField(field, $event)"
    )
    //- Custom
    slot(
      v-else-if="field.slot"
      :name="`field.${field.slot}`"
      :object="field.object"
      :attribute="field.attribute"
    )
</template>

<script>
  import Vue from 'vue'
  import { requiredRule, rangeRule, formatRule } from '@/functions'
  import VDateField from './VDateField'
  import VMoneyField from './VMoneyField'

  export default {
    name: 'DynamicField',
    components: {
      VDateField,
      VMoneyField
    },
    props: {
      object: {
        type: Object,
        default: () => ({})
      },
      field: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      visible: false
    }),
    methods: {
      updateField (field, value) {
        Vue.set(this.fieldObject(field), field.attribute, value)
        field.onUpdate && field.onUpdate()
      },
      fieldObject (field) {
        return field.object || this.object
      },
      fieldValue (field) {
        return field.value || this.fieldObject(field)[field.attribute]
      },
      rulesFor (field) {
        let rules = []

        if (field.required) {
          rules.push(requiredRule({ label: field.label }))
        }

        switch (field.inputmode) {
          case 'numeric':
            rules.push(formatRule({ label: field.label, type: 'number' }))
            break
          case 'email':
            rules.push(formatRule({ label: field.label, type: 'email' }))
            break
        }

        if (field.range) {
          rules.push(rangeRule({ ...field.range, label: field.label }))
        }

        return rules
      }
    }
  }
</script>
