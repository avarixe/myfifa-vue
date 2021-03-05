<template>
  <div :key="key">
    <template v-if="readonly">
      <span :class="displayClass">{{ humanizedDisplay }}</span>
    </template>
    <template v-else>
      <v-edit-dialog @close="close">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <span v-on="on">
              <v-badge color="transparent">
                <template #badge>
                  <v-icon color="grey">mdi-circle-edit-outline</v-icon>
                </template>
                <span :class="displayClass">{{ humanizedDisplay }}</span>
              </v-badge>
            </span>
          </template>
          Click to Edit {{ label }}
        </v-tooltip>
        <template #input>
          <v-combobox
            v-if="inputType === 'combobox'"
            v-model="value"
            :items="options"
            :item-avatar="optionAvatar"
            :item-text="optionText"
            :item-value="optionValue"
            :rules="allRules"
            :label="label"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
            autofocus
          >
            <template #item="{ item }">
              <slot
                name="option"
                :item="item"
              >
                <list-option
                  :item="item"
                  :option-avatar="optionAvatar"
                  :option-text="optionText"
                />
              </slot>
            </template>
          </v-combobox>
          <v-money-field
            v-else-if="inputType === 'money'"
            v-model="value"
            :label="label"
            :prefix="team.currency"
            :required="required"
            autofocus
          />
          <v-text-field
            v-else
            v-model="value"
            :label="label"
            :type="inputType"
            :rules="allRules"
            autofocus
          />
        </template>
      </v-edit-dialog>
    </template>
  </div>
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import { isRequired } from '@/functions'
  import ListOption from './ListOption'
  import VMoneyField from './VMoneyField'

  export default {
    name: 'InlineField',
    components: {
      ListOption,
      VMoneyField
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      item: { type: Object, required: true },
      attribute: { type: String, required: true },
      label: { type: String, default: null },
      options: { type: Array, default: () => [] },
      optionAvatar: { type: String, default: null },
      optionText: { type: String, default: null },
      optionValue: { type: String, default: null },
      rules: { type: Array, default: () => [] },
      inputType: { type: String, default: null },
      display: { type: [String, Number], default: null },
      displayClass: { type: String, default: null },
      readonly: { type: Boolean, default: false },
      required: { type: Boolean, default: false }
    },
    data: () => ({
      value: null,
      original: null,
      key: 0
    }),
    computed: {
      humanizedDisplay () {
        const value = this.display || this.value
        return !value && value !== 0 ? '-' : value
      },
      isDirty () {
        return this.value !== this.original
      },
      allRules () {
        return this.required
          ? [isRequired(this.label), ...this.rules]
          : this.rules
      }
    },
    watch: {
      item: {
        handler () {
          this.reset()
        },
        immediate: true
      },
      attribute () {
        this.reset()
      }
    },
    methods: {
      reset () {
        this.value = this.item[this.attribute]
        this.original = this.value
        this.key++
      },
      close () {
        if (this.allRules.some(rule => typeof rule(this.value) === 'string')) {
          this.reset()
        } else if (this.isDirty) {
          this.$emit('close', this.value)
          this.key++
        }
      }
    }
  }
</script>
