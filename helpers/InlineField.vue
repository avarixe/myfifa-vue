<template>
  <div>
    <template v-if="readonly">
      <span :class="displayClass">{{ display }}</span>
    </template>
    <template v-else>
      <v-edit-dialog @close="close">
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
          <v-select
            v-else-if="inputType === 'select'"
            v-model="value"
            :items="options"
            :rules="rules"
            :label="label"
            menu-props="auto"
          />
          <v-text-field
            v-else-if="inputType === 'money'"
            v-model="value"
            :rules="rules"
            :label="label"
            :hint="$_formatMoney(value)"
            :prefix="team.currency"
            persistent-hint
            type="number"
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

  export default {
    mixins: [
      TeamAccessible
    ],
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
      readonly: Boolean,
      open: Function
    },
    data: () => ({
      value: null,
      original: null
    }),
    computed: {
      display () {
        const humanizedValue = this.humanizer(this.value)
        return humanizedValue === null || humanizedValue === ''
          ? '-'
          : humanizedValue
      },
      isDirty () {
        return this.value !== this.original
      }
    },
    mounted () {
      this.value = this.item[this.attribute]
    },
    methods: {
      close () {
        this.isDirty && this.$emit('close', this.value)
      }
    }
  }
</script>
