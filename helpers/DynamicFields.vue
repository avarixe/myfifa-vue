<template>
  <v-row dense>
    <v-scroll-y-transition
      v-for="(field, i) in fields"
      :key="i"
      mode="out-in"
    >
      <v-col :cols="field.cols || 12">
        <!-- String -->
        <v-text-field
          v-if="field.type === 'string'"
          :label="field.label"
          :prepend-icon="field.prependIcon"
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
          :hide-details="field.hideDetails"
          :rules="rulesFor(field)"
          :value="field.object[field.attribute]"
          @input="updateField(field, $event)"
        />

        <!-- Date -->
        <v-date-field
          v-else-if="field.type === 'date'"
          :value="field.object[field.attribute]"
          :label="field.label"
          :prepend-icon="field.prependIcon"
          :required="field.required"
          :color="field.color"
          @input="updateField(field, $event)"
        />

        <!-- File -->
        <v-file-input
          v-else-if="field.type === 'file'"
          :value="field.object[field.attribute]"
          :label="field.label"
          @change="updateField(field, $event)"
        />

        <!-- Player Select -->
        <player-select
          v-else-if="field.type === 'player'"
          :label="field.label"
          :players="field.players"
          :item-value="field.itemValue"
          :hide-details="field.hideDetails"
          :required="field.required"
          :value="field.object[field.attribute]"
          @input="updateField(field, $event)"
        />
      </v-col>
    </v-scroll-y-transition>
  </v-row>
</template>

<script>
  import { Component, Vue, Prop } from 'nuxt-property-decorator'
  import { requiredRule } from './utilities'
  import PlayerSelect from './PlayerSelect'
  import VDateField from './VDateField'

  @Component({
    components: {
      PlayerSelect,
      VDateField
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

      return rules
    }
  }
</script>
