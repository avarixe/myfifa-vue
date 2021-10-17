<script>
  import { ref, toRefs, computed, watch } from '@nuxtjs/composition-api'

  export default {
    name: 'InlineSelect',
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
    setup (props, { emit }) {
      const menu = ref(false)
      const value = ref(null)
      const original = ref(null)
      const key = ref(0)

      const { display, item, attribute } = toRefs(props)

      const reset = () => {
        value.value = item.value[attribute.value]
        original.value = value.value
        key.value++
      }

      watch(item, reset, { immediate: true })
      watch(attribute, reset)

      const humanizedDisplay = computed(() => {
        const val = display.value || value.value
        return val === null || val === '' ? '-' : val
      })
      const emitChange = item => {
        emit('change', props.optionValue ? item[props.optionValue] : item)
      }
      return {
        value,
        key,
        menu,
        humanizedDisplay,
        emitChange
      }
    }
  }
</script>

<template>
  <div :key="key">
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
