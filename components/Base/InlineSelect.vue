<template>
  <div>
    <span
      v-if="readonly"
      :class="displayClass"
    >
      {{ humanizedDisplay }}
    </span>
    <v-menu
      v-else
      v-model="menu"
      auto
    >
      <template #activator="{ on: menu }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <span v-on="{ ...menu, ...tooltip }">
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
      </template>
      <v-list>
        <list-option
          v-for="(option, i) in options"
          :key="i"
          :item="option"
          :option-avatar="optionAvatar"
          :option-text="optionText"
          :selected="value === (optionValue ? option[optionValue] : option)"
          :dense="dense"
          @click="emitChange(option)"
        />
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import ListOption from './ListOption'

  export default {
    name: 'InlineSelect',
    components: {
      ListOption
    },
    props: {
      item: { type: Object, required: true },
      attribute: { type: String, required: true },
      label: { type: String, default: null },
      options: { type: Array, default: () => [] },
      optionAvatar: { type: String, default: null },
      optionText: { type: String, default: null },
      optionValue: { type: String, default: null },
      rules: { type: Array, default: () => [] },
      display: { type: [String, Number], default: null },
      displayClass: { type: String, default: null },
      readonly: { type: Boolean, default: false },
      dense: { type: Boolean, default: false }
    },
    data: () => ({
      menu: false,
      value: null,
      original: null,
      key: 0
    }),
    computed: {
      humanizedDisplay () {
        const value = this.display || this.value
        return value === null || value === '' ? '-' : value
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
      },
      emitChange (item) {
        this.$emit('change', this.optionValue ? item[this.optionValue] : item)
      }
    }
  }
</script>
