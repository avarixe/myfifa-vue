<template>
  <v-row dense>
    <v-scroll-y-transition
      v-for="(field, i) in fields"
      :key="i"
      mode="out-in"
    >
      <v-col
        v-if="!field.hidden"
        :cols="field.cols || 12"
      >
        <!-- String -->
        <v-text-field
          v-if="field.type === 'string'"
          :label="field.label"
          :prepend-icon="field.prependIcon"
          :inputmode="field.inputmode"
          :spellcheck="field.spellcheck"
          :autocapitalize="field.autocapitalize"
          :autocomplete="field.autocomplete"
          :autocorrect="field.autocorrect"
          :rules="rulesFor(field)"
          :value="field.object[field.attribute]"
          @input="updateField(field, $event)"
        />

        <!-- Select -->
        <v-select
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
          :rules="rulesFor(field)"
          :value="field.object[field.attribute]"
          @input="updateField(field, $event)"
        />

        <!-- Combobox -->
        <v-combobox
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
          :hide-details="field.hideDetails"
          :spellcheck="field.spellcheck"
          :autocapitalize="field.autocapitalize"
          :autocomplete="field.autocomplete"
          :autocorrect="field.autocorrect"
          :rules="rulesFor(field)"
          :value="field.object[field.attribute]"
          @input="updateField(field, $event)"
          @click:append-outer="field.clickAppendOuter && field.clickAppendOuter()"
        />

        <!-- Checkbox -->
        <v-checkbox
          v-else-if="field.type === 'checkbox'"
          :label="field.label"
          :hide-details="field.hideDetails"
          :disabled="field.disabled"
          :value="field.object[field.attribute]"
          @change="updateField(field, $event)"
        />

        <!-- Date -->
        <v-date-field
          v-else-if="field.type === 'date'"
          :label="field.label"
          :prepend-icon="field.prependIcon"
          :required="field.required"
          :color="field.color"
          :min="field.min"
          :value="field.object[field.attribute]"
          @input="updateField(field, $event)"
        />

        <!-- Money -->
        <v-money-field
          v-else-if="field.type === 'money'"
          :label="field.label"
          :prefix="field.prefix"
          :required="field.required"
          :value="field.object[field.attribute]"
          @input="updateField(field, $event)"
        />

        <!-- File -->
        <v-file-input
          v-else-if="field.type === 'file'"
          :label="field.label"
          :value="field.object[field.attribute]"
          @change="updateField(field, $event)"
        />

        <!-- Custom -->
        <slot
          v-else-if="field.slot"
          :name="`field.${field.slot}`"
          :object="field.object"
          :attribute="field.attribute"
        />
      </v-col>
    </v-scroll-y-transition>
  </v-row>
</template>

<script>
  import { Component, Vue, Prop } from 'nuxt-property-decorator'
  import { requiredRule, rangeRule, formatRule } from './utilities'
  import VDateField from './VDateField'
  import VMoneyField from './VMoneyField'

  @Component({
    components: {
      VDateField,
      VMoneyField
    }
  })
  export default class DynamicFields extends Vue {
    @Prop(Array) fields

    updateField (field, value) {
      Vue.set(field.object, field.attribute, value)
    }

    rulesFor (field) {
      let rules = []

      if (field.required) {
        rules.push(requiredRule({ label: field.label }))
      }

      if (field.inputmode === 'numeric') {
        rules.push(formatRule({ label: field.label, type: 'number' }))
      }

      if (field.range) {
        rules.push(rangeRule({ ...field.range, label: field.label }))
      }

      return rules
    }
  }
</script>
