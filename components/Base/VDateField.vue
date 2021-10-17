<script>
  import { ref, toRefs, computed, watch } from '@nuxtjs/composition-api'
  import { nextTick } from 'vue'
  import { format, parseISO } from 'date-fns'
  import { isRequired } from '@/functions'

  export default {
    name: 'VDateField',
    props: {
      value: { type: String, default: null },
      label: { type: String, required: true },
      min: { type: String, default: null },
      max: { type: String, default: null },
      color: { type: String, default: null },
      prependIcon: { type: String, default: null },
      appendOuterIcon: { type: String, default: null },
      required: { type: Boolean, default: false },
      startWithYear: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      dense: { type: Boolean, default: false },
      outlined: { type: Boolean, default: false },
      hideDetails: { type: Boolean, default: false },
      clearable: { type: Boolean, default: false }
    },
    setup (props, { emit }) {
      const menu = ref(false)
      const date = ref(null)
      const activePicker = ref('DATE')

      const { value } = toRefs(props)
      watch(value, () => {
        date.value = value.value
      }, { immediate: true })

      watch(date, dateValue => {
        emit('input', dateValue)
      })

      watch(menu, async (open) => {
        if (open && props.startWithYear) {
          await nextTick()
          activePicker.value = 'YEAR'
        }
      })

      const formattedDate = computed(() => {
        return date.value
          ? format(parseISO(date.value), 'MMM dd, yyyy')
          : null
      })
      return {
        menu,
        date,
        activePicker,
        formattedDate,
        rules: props.required ? [isRequired(props.label)] : []
      }
    }
  }
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        :value="formattedDate"
        :rules="rules"
        :label="label"
        :prepend-icon="prependIcon"
        :append-outer-icon="appendOuterIcon"
        readonly
        :clearable="clearable"
        :disabled="disabled"
        :dense="dense"
        :outlined="outlined"
        :hide-details="hideDetails"
        v-on="{ ...on, ...$listeners }"
      />
    </template>
    <v-date-picker
      ref="picker"
      v-model="date"
      :color="color"
      :min="min"
      :max="max"
      :active-picker.sync="activePicker"
      @input="menu = false"
    />
  </v-menu>
</template>
