<script>
  import { ref, toRefs, computed, watch } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'
  import { isRequired } from '@/functions'

  export default {
    name: 'InlineField',
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
    setup (props, { emit }) {
      const value = ref(null)
      const original = ref(null)
      const key = ref(0)

      const { display, item, attribute } = toRefs(props)

      function reset () {
        value.value = item.value[attribute.value]
        original.value = value.value
        key.value++
      }

      watch(item, reset, { immediate: true })
      watch(attribute, reset)

      const { team } = useTeam()
      const isDirty = computed(() => value.value !== original.value)
      const allRules = computed(() => {
        return props.required
          ? [isRequired(props.label), ...props.rules]
          : props.rules
      })
      return {
        value,
        key,
        humanizedDisplay: computed(() => {
          const val = display.value || value.value
          return !val && val !== 0 ? '-' : val
        }),
        allRules,
        team,
        close: () => {
          if (allRules.value.some(rule => typeof rule(value.value) === 'string')) {
            reset()
          } else if (isDirty.value) {
            emit('close', value.value)
            key.value++
          }
        }
      }
    }
  }
</script>

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
