<template>
  <div :key="key">
    <template v-if="readonly">
      <span :class="displayClass">{{ humanizedDisplay }}</span>
    </template>
    <template v-else>
      <v-edit-dialog
        @open="open"
        @close="close"
      >
        <span :class="displayClass">{{ humanizedDisplay }}</span>
        <template #input>
          <v-combobox
            v-if="inputType === 'combobox'"
            v-model="value"
            :items="options"
            :item-avatar="optionAvatar"
            :item-text="optionText"
            :item-value="optionValue"
            :rules="rules"
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
          <v-select
            v-else-if="inputType === 'select'"
            v-model="value"
            :items="options"
            :item-avatar="optionAvatar"
            :item-text="optionText"
            :item-value="optionValue"
            :rules="rules"
            :label="label"
            menu-props="auto"
            @change="close"
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
          </v-select>
          <v-text-field
            v-else-if="inputType === 'money'"
            v-model="value"
            :rules="rules"
            :label="label"
            :hint="$_formatMoney(value)"
            :prefix="team.currency"
            persistent-hint
            type="number"
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
  import { TeamAccessible } from '@/mixins'
  import ListOption from './ListOption'

  export default {
    mixins: [
      TeamAccessible
    ],
    components: {
      ListOption
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      attribute: {
        type: String,
        required: true
      },
      label: String,
      options: Array,
      optionAvatar: String,
      optionText: String,
      optionValue: String,
      rules: Array,
      inputType: String,
      display: [String, Number],
      displayClass: String,
      readonly: Boolean
    },
    data: () => ({
      value: null,
      original: null,
      key: 0
    }),
    computed: {
      humanizedDisplay () {
        const value = this.display || this.value
        return value === null || value === '' ? '-' : value
      },
      isDirty () {
        return this.value !== this.original
      }
    },
    watch: {
      item: {
        immediate: true,
        handler () {
          this.reset()
        }
      },
      attribute () {
        this.reset()
      }
    },
    methods: {
      reset () {
        this.value = this.item[this.attribute]
        this.original = this.value
      },
      open () {
      },
      close () {
        if (this.isDirty) {
          this.$emit('close', this.value)
          this.key++
        }
      }
    }
  }
</script>
